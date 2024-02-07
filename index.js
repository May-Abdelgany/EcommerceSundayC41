import path from 'path'
import dotenv from 'dotenv'
dotenv.config({ path: path.resolve('./config/.env') })
import express from 'express'
import initApp from './src/index.router.js'
import cors from 'cors'
const app = express()
// setup port and the baseUrl
//app.use(cors())

// var whitelist = ['http://example1.com', 'http://example2.com']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

// app.use(cors(corsOptions))
// app.use((req, res, next) => {
//     console.log(req.header.origin);
// })



// if (process.env.MOOD == 'DEV') {
//     app.use(cors())
// } else {
//     app.use(async (req, res, next) => {
//         if (!whitelist.includes(req.header('origin'))) {
//             return next(new Error('Not allowed by CORS', { cause: 502 }))
//         }
//         await res.header('Access-Control-Allow-Origin', '*')
//         await res.header('Access-Control-Allow-Header', '*')
//         await res.header('Access-Control-Allow-Private-Network', 'true')
//         await res.header('Access-Control-Allow-Method', '*')
//         next()
//     })
// }


app.use(cors())


const port = process.env.PORT || 5000
initApp(app, express)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))