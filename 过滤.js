function main(config) {
    if (config && Array.isArray(config.proxies)) {
        // 中文关键词列表
        const chineseKeywords = ['群', '邀请', '返利', '循环', '官网', '客服', '网站', '网址', '获取', '订阅', '流量', '到期', '机场', '下次', '版本', '官址', '备用', '过期', '已用', '联系', '邮箱', '工单', '贩卖', '通知', '倒卖', '防止', '国内', '建议', '地址', '频道', '无法', '说明', '使用', '提示', '特别', '访问', '支持', '10x', '8x', '6x'];

        // 英文关键词列表，使用小写以便不区分大小写匹配
        const englishKeywords = ['use', 'used', 'total', 'expire', 'email', 'panel'];

        // 过滤代理列表
        const filteredProxies = config.proxies.filter(proxy => {
            const proxyName = proxy.name;
            if (!proxyName) {
                return false;
            }

            // 检查是否包含中文关键词
            const hasChineseKeyword = chineseKeywords.some(keyword => proxyName.includes(keyword));
            if (hasChineseKeyword) {
                return false;
            }

            // 检查是否包含英文关键词（不区分大小写）
            const lowerCaseName = proxyName.toLowerCase();
            const hasEnglishKeyword = englishKeywords.some(keyword => {
                // 使用单词边界 \b 检查是否为完整单词
                const regex = new RegExp(`\\b${keyword}\\b`);
                return regex.test(lowerCaseName);
            });
            if (hasEnglishKeyword) {
                return false;
            }

            // 检查是否包含日期或以G结尾的数字
            // 日期格式：YYYY-MM-DD
            const hasDate = /\d{4}-\d{2}-\d{2}/.test(proxyName);
            if (hasDate) {
                return false;
            }
            
            // 流量格式：数字+G
            const hasTraffic = /\d+G/.test(proxyName);
            if (hasTraffic) {
                return false;
            }
            
            // 如果所有检查都通过，则保留该代理
            return true;
        });

        return {
            proxies: filteredProxies
        };
    }
    return {};
}
