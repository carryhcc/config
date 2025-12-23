#!/bin/bash

# --- 配置区 ---
SENDKEY="xxxxxxx"
INTERFACE="eth0"
# --------------

# 获取当前时间
DATE=$(date '+%Y-%m-%d %H:%M')

# 获取 vnstat 的单行统计数据
# 格式: 1;interface;today_date;rx;tx;total;avg;month_date;rx;tx;total;avg;all_total...
STATS=$(vnstat -i $INTERFACE --oneline)

# --- 1. 提取今日流量 (Daily) ---
RX_TODAY=$(echo $STATS | cut -d ";" -f 4)
TX_TODAY=$(echo $STATS | cut -d ";" -f 5)
TOTAL_TODAY=$(echo $STATS | cut -d ";" -f 6)

# --- 2. 提取当月流量 (Monthly) ---
RX_MONTH=$(echo $STATS | cut -d ";" -f 8)
TX_MONTH=$(echo $STATS | cut -d ";" -f 9)
TOTAL_MONTH=$(echo $STATS | cut -d ";" -f 10)

# --- 3. 提取历史总累计 ---
TOTAL_ALL=$(echo $STATS | cut -d ";" -f 11)

# --- 构造 Markdown 消息内容 ---
TITLE="🚀 服务器流量日报"
DESP="#### 📅 统计时间: $DATE

---

### 📥 今日流量统计
- **当日下载 (RX):** \`$RX_TODAY\`
- **当日上传 (TX):** \`$TX_TODAY\`
- **当日总计:** \`$TOTAL_TODAY\`

### 📅 本月累计流量
- **当月下载 (RX):** \`$RX_MONTH\`
- **当月上传 (TX):** \`$TX_MONTH\`
- **当月总计:** \`$TOTAL_MONTH\`

---

### 📈 历史总计
- **历史总流量:** \`$TOTAL_ALL\`

> *注：单位随流量大小自动切换 (MiB/GiB/TiB)*"

# 发送请求到 Server酱
# 使用 --data-urlencode 确保特殊字符（如换行和#号）能正确传输
curl -s -X POST "https://13421.push.ft07.com/send/${SENDKEY}.send" \
    -d "title=${TITLE}" \
    --data-urlencode "desp=${DESP}"
