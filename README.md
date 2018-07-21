# 1day-release-tabinoshiori
旅のしおり

## Data format
```
[
  {
    "plan_id": "1fCnEVwyKWVsPkNEb6yCkEJCShd_2k2mcfmnyav7G8zI", // base58 44文字
    "title": "北海道旅行",
    "date": "2018-08-19",
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
    ]
  }
]
```

## Websocket(WS)

### プランの作成(*_create_plan)
#### in
+ title: String

```
socket.emit('in_create_plan', {title: "北海道旅行"})
```

#### out
+ plan_id: Integer

```
socket.on('out_create_plan', (data) => {
  console.log(data.plan_id) // 1fCnEVwyKWVsPkNEb6yCkEJCShd_2k2mcfmnyav7G8zI
})
```

### プランの読み込み(*_load_plan)
#### in
+ plan_id: plan_id

```
socket.emit('in_load_plan', {plan_id: "1fCnEVwyKWVsPkNEb6yCkEJCShd_2k2mcfmnyav7G8zI"})
```

#### out
+ plan: Object

```
socket.on('out_load_plan', (data) => {
  console.log(data.plan) // {"plan_id":...}
})
```

### プランの保存(*_save_plan)
#### in
+ plan: Object

```
socket.emit('in_save_plan', {plan: {"plan_id":...}})
```

#### out
##### 成功
+ status: "Success"
+ plan_id: Integer

```
socket.on('out_save_plan', (data) => {
  console.log(data.status) // Success
  console.log(data.plan_id) // 1fCnEVwyKWVsPkNEb6yCkEJCShd_2k2mcfmnyav7G8zI
})

```
##### 失敗
+ status: "Failure"
+ message: String

```
socket.on('out_save_plan', (data) => {
  console.log(data.status) // Failure
  console.log(data.message) // 予定時間が重複しています
})
```

### プランの一覧(*_load_plan_list)
#### in
+ password: String

```
socket.emit('in_load_plan_list', {password: "xxx"})
```

#### out
##### 成功
+ status: "Success"
+ list: Array

```
socket.on('out_load_plan_list', (data) => {
  console.log(data.status) // Success
  console.log(data.list) // [{"plan_id":...}]
})
```

##### 失敗
+ status: "Failure"

```
socket.on('out_load_plan_list', (data) => {
  console.log(data.status) // Failure
})
```


