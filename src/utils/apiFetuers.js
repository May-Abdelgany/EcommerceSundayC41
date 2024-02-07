export class ApiFeatures {
    constructor(mongooseQuery, data) {
        this.mongooseQuery = mongooseQuery
        this.data = data
    }
    //pagination 
    paginate() {
        let { page, size } = this.data

        if (!page || page <= 0) {
            page = 1
        }
        if (!size || size <= 0) {
            size = 5
        }
        const skip = (page - 1) * size
        this.mongooseQuery.limit(parseInt(size)).skip(parseInt(skip))
        return this;
    }

    filter() {
        let filter = { ...this.data }
        let excludeQueryParams = ['page', 'size', 'fields', 'skip', 'sort', 'search']
        excludeQueryParams.forEach((element) => {
            delete filter[element]
        })
        filter = JSON.parse(JSON.stringify(filter).replace(/(gt|lt|gte|lte|eq|ne|nin|in)/g, (match) => `$${match}`))
        this.mongooseQuery.find(filter)
        return this;
    }

    sort() {
        if (this.data.sort) {
            this.mongooseQuery.sort(this.data.sort.replaceAll(',', ' '))
            return this;
        }
        return this;
    }
    fields() {
        if (this.data.fields) {
            this.mongooseQuery.select(this.data.fields.replaceAll(',', ' '))
            return this;
        }
        return this;
    }
    search() {
        if (this.data.search) {
            this.mongooseQuery.find({
                $or: [
                    { name: { $regex: this.data.search } },
                    { description: { $regex: this.data.search } }
                ]
            })
        }
        return this;
    }
}