
new Vue({
    el: '#container',
    data: {
        "plan_id": "1fCnEVwyKWVsPkNEb6yCkEJCShd_2k2mcfmnyav7G8zI", // base58 44文字
        "title": "北海道旅行",
        "date": "2018-07-29",
        "description": "2泊3日",
        "timeline": [
          [ // 1日目
            {
              "title": "JetStarに乗る",
              "start_time": "13:00",
              "end_time": "15:00",
              "place": "羽田空港第二ターミナル",
              "price": "9800",
              "description": "チェックインは1時間前"
            },
            {
              "title": "test",
              "start_time": "13:00",
              "end_time": "15:00",
              "place": "羽田空港第二ターミナル",
              "price": "9800",
              "description": "チェックインは1時間前"
            }
  
          ],
          [ // 2日目
            {
              "title": "旭山動物園に行く",
              "start_time": "9:00",
              "end_time": "11:00",
              "place": "旭山動物園",
              "price": "2000", // nullを許容
              "description": "朝食は9:00まで"
            }
          ]
        ],
        active_day: 0,
        active_task: 1
    },
    methods: {
        addTask (task) {
            this.task.push(task)
            socket.emit('', task);
        },
        activeTask(index){
            this.active_task = index;
        },
        isActiveTask(index){
            console.log(this.active_task,index)
            if(this.active_task == index){
                return true;
            }else{
                return false;
            }
        },
        isActiveDay(index){
            console.log(this.active_day,index)
            if(this.active_day == index){
                return true;
            }else{
                return false;
            }
        },
        getDate(index){
            let date = new Date(this.date);
            date.setDate(date.getDate() + index);
            console.log("getDate",date);
            return date.getMonth() + 1 + "月" + date.getDate() +"日"
        }
    }
})
