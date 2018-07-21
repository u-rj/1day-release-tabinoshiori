const socket = io.connect('http://localhost:18010')
socket.on('connect', () => {
  console.log('connected')
})

/*
socket.on('out_create_plan', (data) => {
  console.log(data.plan_id) // 1fCnEVwyKWVsPkNEb6yCkEJCShd_2k2mcfmnyav7G8zI
})
socket.emit('in_create_plan', {
  title: '北海道旅行',
  description: '',
  date: moment().format('YYYY-MM-DD')
})
*/


new Vue({
  el: '#container',
  data: {
    plan: {
      'plan_id': '1fCnEVwyKWVsPkNEb6yCkEJCShd_2k2mcfmnyav7G8zI', // base58 44文字
      'title': '北海道旅行',
      'date': '2018-07-29',
      'description': '2泊3日',
      'timeline': [
        [ // 1日目
          {
            'title': 'JetStarに乗る',
            'start_time': '13:00',
            'end_time': '15:00',
            'place': '羽田空港第二ターミナル',
            'price': '9800',
            'description': 'チェックインは1時間前'
          },
          {
            'title': 'test',
            'start_time': '13:00',
            'end_time': '15:00',
            'place': '羽田空港第二ターミナル',
            'price': '9800',
            'description': 'チェックインは1時間前'
          }

        ],
        [ // 2日目
          {
            'title': '旭山動物園に行く',
            'start_time': '9:00',
            'end_time': '11:00',
            'place': '旭山動物園',
            'price': '2000', // nullを許容
            'description': '朝食は9:00まで'
          }
        ]
      ]
    },
    active_day: 0,
    active_task: 1,
    planId: '',
    editMode: false
  },
  mounted () {
    // this.getUrlData()
    // this.setSocketOn()
    // this.loadPlan()
    // this.savePlan()
  },
  methods: {
    getUrlData () {
      this.planId = url('?plan_id')
      if (!this.planId) {
        alert('error')
        return
      }
      this.editMode = (url('?edit') === '1')
      console.log(this.planId, this.editMode)
    },
    setSocketOn () {
      socket.on('out_load_plan', (data) => {
        if (!data.plan) {
          alert('データの読み込みに失敗しました')
          return
        }
        console.log(data.plan)
        this.plan = data.plan
      })

      socket.on('out_save_plan', (data) => {
        if (data.status === 'Failure') {
          alert(data.message)
          return
        }

        this.loadPlan()
      })
    },
    loadPlan () {
      socket.emit('in_load_plan', {plan_id: this.planId})
    },
    savePlan () {
      setTimeout(() => {
        this.plan.title += '2'
        socket.emit('in_save_plan', {plan: this.plan})
      }, 1000)
    },
    addTask (task) {
      this.task.push(task)
      socket.emit('', task)
    },
    addTask (task) {
      this.task.push(task)
      socket.emit('', task)
    },
    activeTask(index){
      this.active_task = index
    },
    isActiveTask(index){
      console.log(this.active_task,index)
      if(this.active_task == index){
        return true
      }else{
        return false
      }
    },
    isActiveDay(index){
      console.log(this.active_day,index)
      if(this.active_day == index){
        return true
      }else{
        return false
      }
    },
    getDate(index){
      let date = new Date(this.date)
      date.setDate(date.getDate() + index)
      console.log('getDate',date)
      return date.getMonth() + 1 + '月' + date.getDate() +'日'
    }
  }
})
