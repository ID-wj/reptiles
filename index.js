async function fun() {
  const config = require('./config');
  const fs = require("fs");
  const path = require("path");
  const axios = require("axios")

  //使用的地图配置名
  const mapName = 'amap'
  // 获取配置
  const mapConfig = config[mapName]
  const wprd = mapConfig.domain || []
  //处理地址请求
  const replaceZXY = (str, z, x, y, sIndex) => {
    let res = str
    let s = wprd[sIndex]
    const obj = { x, y, z, s };
    res = res.replace(/\{\w+?\}/g, patern => {
      const whiteList = ["{x}", "{y}", "{z}", "{s}"];
      const no = patern.match(/(?<=\{)\w+?(?=\})/)[0];

      if (whiteList.includes(patern)) {
        return obj[no];
      } else {
        return mapConfig[no]
      }
    });
    return res
  }
  
  //判断是否已存在路径
  const isAccess = (filename) => {
    return fs.promises
      .access(filename)
  }

  // 生成result文件夹
  const filePath = path.resolve(__dirname, "./result");
  const creatDir = (filePath) => {
    return fs.promises.mkdir(filePath, { recursive: true })
  }
  await creatDir(filePath).then(() => {
    console.log('create result')
  })

  // 请求数据
  const getData = (preUrl) => {
    return axios.get(preUrl, {
      responseType: "stream"
    })
  }

  // 循环开始
  for (let i = mapConfig.z[0]; i < mapConfig.z[1]; i++) {
    const count = Math.pow(2, i)
    const zPath = path.join(filePath, `./${i}`)
    await creatDir(zPath).then(() => {
      console.log('create z')
    })
    for (let x = 0; x < count; x++) {
      const xPath = path.join(zPath, `./${x}`)
      await creatDir(xPath).then(() => {
        console.log('create x')
      })
      for (let y = 0; y < count; y++) {
        let sIndex = 0
        const preUrl = replaceZXY(mapConfig.url, i, x, y, sIndex);
        const yPath = `${xPath}/${y}.png`
        isAccess(preUrl, yPath).catch(() => {
          const getImg = (preUrl, yPath) => {
            getData(preUrl).then(res => {
              res.data.pipe(fs.createWriteStream(yPath));
            })
            .catch(() => {
              sIndex = sIndex + 1
              if(sIndex > wprd.length - 1) return
              // 请求失败修改s值再次请求
              const spareUrl = replaceZXY(mapConfig.url, i, x, y, sIndex);
              getImg(spareUrl, yPath)
            })
          }
          getImg(preUrl, yPath)
        })
      }
    }
  }
}

fun();