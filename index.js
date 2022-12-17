const fs = require('fs')  
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate')

// FILES
// Blocking synchronous way 
// const fileIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// const fileOut = `This is th info about avocado: ${fileIn}\n Created At ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', fileOut)
// console.log('created a new output file')

// console.log(fileIn)

// Non-blocking way

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log('Error!')
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2)
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3)
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, err => {
//                 console.log('finallly created everything')
//             })
//         })
//     })
// })
// console.log('i will run first because i am in an asynchronous function')


// SERVER



const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')

const dataObj = JSON.parse(data)



const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true)

    // OVERVIEW PAGE
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type' : 'text/html'})
        const dataHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
        const output = tempOverview.replace(/{%PRODUCTS_CARD%/g, dataHtml)
        res.end(output)

    // PRODUCT PAGE
    } else if (pathname === '/product') {
        res.writeHead(200, {'Content-type' : 'text/html'})
        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product)
        res.end(output)

    // API
    } else if(pathname === '/api') {
        res.writeHead(200, {
            'Content-type' : 'application/json'
        })
        res.end(data)

     // NOT FOUND PAGE

    }else {
        res.writeHead(404, {
            'Content-Type' : 'text/html',
            'my-own-header' : 'hello world!'
        })
        res.end('<h1>page not found</h1>')
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log('listening to server on PORT 8000 ')
})