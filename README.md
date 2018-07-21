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
in_*でリクエストする。
out_*でリクエストする。

### プランの作成(*_new_plan)
#### in
+ title: String

```
socket.emit('in_new_plan', {title: "北海道旅行"})
```

#### out
+ plan_id: Integer

```
socket.on('out_new_plan', (data) => {
  console.log(data.plan_id) // 1fCnEVwyKWVsPkNEb6yCkEJCShd_2k2mcfmnyav7G8zI
})

```

### プランの読み込み(*_load_plan)
#### in
+ plan_id: plan_id
#### out
+ plan: Object

### プランの保存(*_save_plan)
#### in
+ plan: Object
#### out
##### 失敗
+ status: "Failure"
+ message: String
##### 成功
+ status: "Success"
+ plan_id: Integer

### プランの一覧(*_load_plan_list)
#### in
+ password: String
#### out
timelineのデータ以外を含む

+ plan: Array



