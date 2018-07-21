const fs = require('fs')
const moment = require('moment')
const _ = require('underscore')
const request = require('request')
const http = require('http')
const server = http.createServer()

// *************************
// Functions
// *************************
const writeLog = (...arg) => {
  const fileName = arg.shift()
  let text = ''
  arg.forEach((value, index) => {
    text += JSON.stringify(value) + ((arg.length - 1 > index) ? ', ' : '')
  })
  text = moment().format() + ' ' + text + '\n'
  fs.appendFile(fileName, text, 'utf-8', (e) => {
    if (!e) return 
    console.log('Append log error', e)
  })
}
const postSlack = (token, channel, username, text) => {
  var url = 'https://slack.com/api/chat.postMessage?token=' + token + '&channel=' + channel + '&username=' + username + '&text=' + encodeURIComponent(text)
  request(url, function (error, response, body) {
    if (error || response.statusCode != 200) {
      console.log('Post slack error')
    }
  })
}

const postSlackErrorLog = (...arg) => {
  // const channelName = arg.shift()
  let text = ''
  arg.forEach((value, index) => {
    text += JSON.stringify(value) + ((arg.length - 1 > index) ? ', ' : '')
  })
  text = moment().format() + ' ' + text + '\n'
  postSlack('xoxp-379185118336-380773472022-388164489590-22055d7d999c775eeb53628e57c1bd30', '180721-error', 'server-error', text)
}

const log = (...arg) => {
  console.log(...arg)

  // arg.unshift('console.log')
  // writeLog(...arg)
}

const errorLog = (...arg) => {
  arg.unshift('Error log')
  console.log(...arg)

  arg[0] = 'error.log'
  writeLog(...arg)

  arg.shift()
  postSlackErrorLog(...arg)
}

const getBase58Id = (l) => {
  var alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'

  var cl = alphabet.length
  var r = ''
  for(var i=0; i<l; i++){
    r += alphabet[Math.floor(Math.random()*cl)]
  }

  return r
}

const loadData = () => {
  let data = []
  try {
    data = JSON.parse(fs.readFileSync('data.json', 'utf8'))
  } catch (e) {
    // nop
  }
  return data
}

const saveData = (data) => {
  try {
    fs.writeFileSync('data.json', JSON.stringify(data))
  } catch (e) {
    errorLog(e + '')
  }
}

const backupData = () => {
  try {
    fs.copyFile('data.json', 'data-backup/data-' + moment().format() + '.json', (err) => {
      if (err) errorLog(err + '')
    });
  } catch (e) {
    errorLog(e + '')
  }
}

// *************************
// Main
// *************************
try {
  setInterval(() => {
    backupPlan()
  }, 30 * 60 * 1000) // 30min

  server.on('request', function(req, res) {
    log(req.url)
    let stream = fs.createReadStream('index.html')
    res.writeHead(200, {'Content-Type': 'text/html'})
    stream.pipe(res)
  })

  let io = require('socket.io').listen(server)
  server.listen(18010)

  let plan = loadData()
  io.sockets.on('connection', function(socket) {
    socket.on('in_create_plan', function (data) {
      // Create ID
      let planId = getBase58Id(44)

      // Add data
      plan.push({
        plan_id: planId,
        title: data.title,
        date: data.date,
        description: data.description,
        timeline: [[]]
      })

      // Save Data
      saveData(plan)

      // Response
      socket.emit('out_create_plan', {plan_id: planId})
    })

    socket.on('in_load_plan', function (data) {
      // Search data
      planId = null
      plan.forEach((value, index) => {
        if (value && value.plan_id == data.plan_id) planId = index 
      })

      socket.emit('out_load_plan', {plan: plan[planId]})
    })

    socket.on('in_save_plan', function (data) {
      // Search data
      planIndex = null
      plan.forEach((value, index) => {
        if (value && value.plan_id == data.plan.plan_id) planIndex = index 
      })

      if (planIndex == null) {
        log('Error!!', 'Not exist data')
        return 
      }

      // Validate
      let validateError = ''
      data.plan.timeline.forEach((value, index) => {
        let startTime = new Date('2018/01/01 ' + value.start_time)
        let endTime = (new Date('2018/01/01 ' + value.end_time)).getTime() - 1

        data.plan.timeline.forEach((value2, index2) => {
          if (index === index2) return

          let startTime2= new Date('2018/01/01 ' + value2.start_time)
          let endTime2 = (new Date('2018/01/01 ' + value2.end_time)).getTime() - 1

          if (startTime <= endTime2 && endTime >= startTime2) {
            validateError += value2.start_time + 'が重複しています。\n'
          }
        })
      })

      if (validateError !== '') {
        socket.emit('out_save_plan', {
          status: 'Failure',
          message: validateError
        })
        return
      }
      
      // Sort Data
      let sorted = _.sortBy(data.plan.timeline, function (node) {
        return - (new Date('2018/01/01 ' + node.start_time).getTime())
      })

      // Modily data
      plan[planIndex] = data.plan
      plan[planIndex].timeline = sorted

      // Save data
      saveData(plan)

      // Response
      socket.emit('out_save_plan', {
        status: 'Success',
        plan_id: plan[planIndex].plan_id
      })
    })

    socket.on('in_load_plan_list', function (data) {
      if (data.password !== '180721') {
        socket.emit('out_load_plan_list', {
          status: 'Failure'
        })
        return
      }

      socket.emit('out_load_plan_list', {
        status: 'Success',
        list: plan
      })
    })
  })
} catch(e) {
  errorLog(e + '')
}
