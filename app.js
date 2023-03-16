const express = require('express')
const app = express()
const port = 8888

const distance = (x, y) => Math.sqrt(x * x + y * y)

app.get('/', (req, res) => {
  const data = {"protocols":["closest-enemies"],"scan":[{"coordinates":{"x":89,"y":13},"enemies":{"type":"mech","number":1}},{"coordinates":{"x":11,"y":35},"enemies":{"type":"soldier","number":10}},{"coordinates":{"x":19,"y":49},"enemies":{"type":"soldier","number":10}},{"coordinates":{"x":38,"y":21},"enemies":{"type":"soldier","number":30}},{"coordinates":{"x":10,"y":39},"enemies":{"type":"soldier","number":30}},{"coordinates":{"x":13,"y":38},"enemies":{"type":"soldier","number":15}},{"coordinates":{"x":13,"y":15},"enemies":{"type":"soldier","number":60}},{"coordinates":{"x":30,"y":19},"enemies":{"type":"soldier","number":40}},{"coordinates":{"x":30,"y":11},"enemies":{"type":"soldier","number":20}},{"coordinates":{"x":15,"y":19},"enemies":{"type":"soldier","number":80}},{"coordinates":{"x":22,"y":15},"enemies":{"type":"soldier","number":10}},{"coordinates":{"x":10,"y":19},"enemies":{"type":"soldier","number":10}},{"coordinates":{"x":94,"y":11},"enemies":{"type":"soldier","number":10}},{"coordinates":{"x":10,"y":19},"enemies":{"type":"soldier","number":30}},{"coordinates":{"x":90,"y":18},"enemies":{"type":"soldier","number":30}},{"coordinates":{"x":80,"y":51},"enemies":{"type":"soldier","number":15}},{"coordinates":{"x":70,"y":91},"enemies":{"type":"soldier","number":60}},{"coordinates":{"x":30,"y":11},"enemies":{"type":"soldier","number":40}},{"coordinates":{"x":30,"y":95},"enemies":{"type":"mech","number":20}},{"coordinates":{"x":1,"y":89},"enemies":{"type":"soldier","number":80}},{"coordinates":{"x":3,"y":11},"enemies":{"type":"soldier","number":10}},{"coordinates":{"x":54,"y":19},"enemies":{"type":"soldier","number":10}},{"coordinates":{"x":22,"y":38},"enemies":{"type":"soldier","number":10}},{"coordinates":{"x":3,"y":10},"enemies":{"type":"soldier","number":30}},{"coordinates":{"x":43,"y":13},"enemies":{"type":"soldier","number":30}},{"coordinates":{"x":51,"y":13},"enemies":{"type":"soldier","number":15}},{"coordinates":{"x":91,"y":30},"enemies":{"type":"soldier","number":60}},{"coordinates":{"x":11,"y":30},"enemies":{"type":"soldier","number":40}},{"coordinates":{"x":91,"y":15},"enemies":{"type":"soldier","number":20}},{"coordinates":{"x":51,"y":22},"enemies":{"type":"soldier","number":80}},{"coordinates":{"x":91,"y":10},"enemies":{"type":"mech","number":10}},{"coordinates":{"x":11,"y":84},"enemies":{"type":"soldier","number":10}},{"coordinates":{"x":91,"y":65},"enemies":{"type":"soldier","number":10}},{"coordinates":{"x":81,"y":53},"enemies":{"type":"mech","number":30}},{"coordinates":{"x":15,"y":70},"enemies":{"type":"soldier","number":30}},{"coordinates":{"x":19,"y":83},"enemies":{"type":"soldier","number":15}},{"coordinates":{"x":11,"y":46},"enemies":{"type":"soldier","number":60}},{"coordinates":{"x":59,"y":26},"enemies":{"type":"soldier","number":40}},{"coordinates":{"x":98,"y":57},"enemies":{"type":"soldier","number":20}},{"coordinates":{"x":11,"y":58},"enemies":{"type":"mech","number":80}},{"coordinates":{"x":91,"y":39},"enemies":{"type":"mech","number":10}},{"coordinates":{"x":83,"y":37},"enemies":{"type":"soldier","number":10}},{"coordinates":{"x":0,"y":11},"enemies":{"type":"mech","number":1}}]}
  // Protocols: "avoid-mech", "prioritize-mech", "closest-enemies", "furthest-enemies", "assist-allies", "avoid-crossfire"
  const protocols = data.protocols.includes("furthest-enemies") 
    ? data.protocols 
    : [...new Set(data.protocols.concat("closest-enemies"))]

  console.log(protocols)
  const allies = data.protocols.includes("assist-allies") 
    ? true 
    : data.protocols.includes("avoid-crossfire") 
      ? false 
      : undefined
  
  const mech = data.protocols.includes("prioritize-mech") 
    ? true 
    : data.protocols.includes("avoid-mech") 
      ? false 
      : undefined

  const filteredData = data.scan.filter(
    (item) => (
      allies === true 
        ? typeof item.allies !== "undefined" 
        : allies === false 
          ? typeof item.allies === "undefined" 
          : true
      ) && (
      mech === true 
        ? item.enemies.type === "mech" 
        : mech === false 
          ? item.enemies.type !== "mech" 
          : true
      )
  )

  const result = protocols.includes("closest-enemies") 
    ? filteredData.reduce((result, item) => {
      const dist1 = distance(result.x, result.y)
      const dist2 = distance(item.coordinates.x, item.coordinates.y)
      return dist1 > dist2 ? {
        x: item.coordinates.x,
        y: item.coordinates.y
      } : result
    }, {
      x: 99999,
      y: 99999
    })
    : filteredData.reduce((result, item) => {
      const dist1 = distance(result.x, result.y)
      const dist2 = distance(item.coordinates.x, item.coordinates.y)
      return dist1 < dist2 && dist2 < 100 ? {
        x: item.coordinates.x,
        y: item.coordinates.y
      } : result
    }, {
      x: 0,
      y: 0
    })

  res.send(JSON.stringify(result))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})