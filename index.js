const axios = require('axios').default
const App_Token='AT_uizN7k06aGyN8WxAVv4mjyf94l6jHrA9'

const configs = [{
    area: 'H',
    static_api: 'https://644898358795db000137473f.jussyun.com/cyy_gatewayapi/show/pub/v3/show/658cd4100ce94e0001cb3d52/sessions_static_data?src=WEB&ver=3.3.5&showId=658cd4100ce94e0001cb3d52&privilegeId=',
    dynamic_api: 'https://644898358795db000137473f.jussyun.com/cyy_gatewayapi/show/pub/v3/show/658cd4100ce94e0001cb3d52/sessions_dynamic_data?src=WEB&ver=3.3.5&showId=658cd4100ce94e0001cb3d52&privilegeId='
}, {
    area: 'K',
    static_api: 'https://644898358795db000137473f.jussyun.com/cyy_gatewayapi/show/pub/v3/show/658cd30c0ce94e0001cb3b46/sessions_static_data?src=WEB&ver=3.3.5&showId=658cd30c0ce94e0001cb3b46&privilegeId=',
    dynamic_api: 'https://644898358795db000137473f.jussyun.com/cyy_gatewayapi/show/pub/v3/show/658cd30c0ce94e0001cb3b46/sessions_dynamic_data?src=WEB&ver=3.3.5&showId=658cd30c0ce94e0001cb3b46&privilegeId='
}]
async function getResult(){
    for (let i = 0; i < configs.length; i++) {
        const config = configs[i];
        const staticDataRes = await axios.get(config.static_api)
        const staticData= staticDataRes.data.data
        const showName = staticData.showName
        const seats = staticData.sessionVOs
        const dynamicDataRes = await axios.get(config.dynamic_api)
        const dynanicData=dynamicDataRes.data.data
        const dySeats= dynanicData.sessionVOs

        seats.forEach(seat=>{
            const {bizShowSessionId, sessionName}= seat
            if (sessionName.indexOf('上汽摩专享')>-1)return;
            if (sessionName.indexOf('周五')>-1 || sessionName.indexOf('三日')>-1){
                const found = dySeats.find(dySeat => {
                    if (dySeat.bizShowSessionId === bizShowSessionId){
                        return true
                    }
                    return false
                })
                if (found && found.sessionStatus === 'ON_SALE'){
                    console.log(sessionName, 'On Sale')
                    const title = `${sessionName} 有票啦！`
                    sendSmg(title, `${showName} ${title}`)
                }
            }
           
        })
        
        // console.log(config.area, showName, seats, dySeats)
    }
}

async function sendSmg(summary, content){
    const res = await axios.post('https://wxpusher.zjiecode.com/api/send/message', {
        "appToken":App_Token,
        content,
        summary,//消息摘要，显示在微信聊天页面或者模版消息卡片上，限制长度100，可以不传，不传默认截取content前面的内容。
        "contentType":1,//内容类型 1表示文字  2表示html(只发送body标签内部的数据即可，不包括body标签) 3表示markdown 
        "topicIds":[ //发送目标的topicId，是一个数组！！！，也就是群发，使用uids单发的时候， 可以不传。
          25336
        ],
        // "uids":[//发送目标的UID，是一个数组。注意uids和topicIds可以同时填写，也可以只填写一个。
        //     "UID_xxxx"
        // ],
        //"url":"https://wxpusher.zjiecode.com", //原文链接，可选参数
        "verifyPay":false //是否验证订阅时间，true表示只推送给付费订阅用户，false表示推送的时候，不验证付费，不验证用户订阅到期时间，用户订阅过期了，也能收到。
      })
      console.log(res.data)
}
getResult()