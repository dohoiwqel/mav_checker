import axios from 'axios'
import Web3 from 'web3'
import * as readline from 'readline'
import * as fs from 'fs'

async function read(fileName) {
    const array = []
    const readInterface = readline.createInterface({
        input: fs.createReadStream(fileName),
        crlfDelay: Infinity,
    })
    for await (const line of readInterface) {
        array.push(line)
    }
    return array
}

async function main() {
    const web3 = new Web3('https://rpc.ankr.com/bsc')
    const wallets = await read('wallets.txt')

    for(let wallet of wallets) {
        try {
            const response = await axios.get(`https://api.mav.xyz/api/claim/1/${wallet}`, {
                headers: {
                    'authority': 'api.mav.xyz',
                    'accept': '*/*',
                    'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                    'cache-control': 'no-cache',
                    'origin': 'https://governance.mav.xyz',
                    'pragma': 'no-cache',
                    'referer': 'https://governance.mav.xyz/',
                    'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
                }
            })            
            console.log(`${wallet} ${web3.utils.fromWei(response.data.claim.amount, 'ether')}`)
        } catch(e) {
            console.log(`${wallet} 0`)
        }
    }
}

main()