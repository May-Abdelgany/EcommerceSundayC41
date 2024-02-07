import path from 'path'
import dotenv from 'dotenv'
dotenv.config({ path: path.resolve('./config/.env') })
import express from 'express'
import initApp from './src/index.router.js'
import cors from 'cors'
// import createInvoice from './src/utils/createInvoice.js'
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


// const invoice = {
//     shipping: {
//       name: "John Doe",
//       address: "1234 Main Street",
//       city: "San Francisco",
//       state: "CA",
//       country: "US",
//       postal_code: 94111
//     },
//     items: [
//       {
//         item: "TC 100",
//         description: "Toner Cartridge",
//         quantity: 2,
//         amount: 6000
//       },
//       {
//         item: "USB_EXT",
//         description: "USB Cable Extender",
//         quantity: 1,
//         amount: 2000
//       }
//     ],
//     subtotal: 8000,
//     paid: 0,
//     invoice_nr: 1234
//   };
  
//   createInvoice(invoice, "invoice.pdf");


const port = process.env.PORT || 5000
initApp(app, express)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))