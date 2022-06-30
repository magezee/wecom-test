import express from 'express'
import axios from 'axios'
import fs from 'fs/promises'
import path from 'path'

import AppConfig from './config/app-config'

const app = express()

app.get('/token', async(req, res, next) => {
  const { data } = await axios.get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${AppConfig.Corpid}&corpsecret=${AppConfig.Secret}`)
  console.log(data)
  res.send(data)
})


const getToken = async () => {
  const cacheTokenPath = './config/token.json'
  type Token = { createTime: number, expireTime: number, token: string }
  
  try {
    // 从缓存中拿到token并判断是否过期
    const cacheToken: Token = JSON.parse(await fs.readFile(path.join(__dirname, cacheTokenPath), { encoding: 'utf-8' })) 
    const currentTime =  Math.floor(Date.now() / 1000)
    const isExpire = cacheToken?.createTime + cacheToken?.expireTime < currentTime
    if (!isExpire) {
      return cacheToken.token
    }
  } catch(err) {
    console.log(`some error happened in get token from cache --- ${err}`)
  }


  // 获取token
  const { data: { access_token, expires_in } } = await axios.get('https://qyapi.weixin.qq.com/cgi-bin/gettoken', {
    params: {
      corpid: AppConfig.Corpid,
      corpsecret: AppConfig.Secret
    }
  })
  
  const token: Token = {
    createTime: Math.floor(Date.now() / 1000),
    expireTime: expires_in,
    token: access_token
  }

  // 缓存token
  await fs.writeFile(path.join(__dirname, cacheTokenPath), JSON.stringify(token), { encoding: 'utf-8' })
  return access_token
}

(async() => {
  const token = await getToken()
  console.log(token)
})()



app.listen(3001, () => {
  console.log('服务启动成功!!')
})




