module.exports = {
  // url: "https://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang={lang}&scl=1&style={style}",
  // z: [3, 5],
  // lang: "zh_cn",
  // style: 7,
  amap: {
    url: "https://wprd{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang={lang}&size={size}&scl={scl}&style={style}",
    scl: 1, // 1:地名 2:无地名
    style: 7, // 6:地貌图 7:地图 8:交通图
    size: 2, // 缩放等级（不知道有什么用）
    lang: "zh_cn", // 语言,
    domain: ["01", "02", "03", "04"],
    z: [3, 4]
  },
  google: {},
  bmap: {}
}