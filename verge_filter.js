/**
 * Clash Verge Rev 增强型预处理器脚本 (修复重复项优化版)
 */

/*
 * =================================================================
 * 1. 配置中心 (Configuration)
 * =================================================================
 */

const FILTER_KEYWORDS = [
  '群', '邀请', '返利', '循环', '官网', '客服', '网站', '网址', '获取',
  '订阅', '流量', '到期', '机场', '下次', '版本', '官址', '备用', '过期',
  '已用', '联系', '邮箱', '工单', '贩卖', '通知', '倒卖', '防止', '国内',
  '建议', '地址', '频道', '无法', '说明', '使用', '提示', '特别', '访问',
  '支持', '10x', '9x', '8x', '7x', '6x', '5x', '4x'
];

const ICONS = {
  US: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_States.png",
  JP: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Japan.png",
  SG: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Singapore.png",
  HK: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hong_Kong.png",
  TW: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Taiwan.png",
  PROXY: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Proxy.png",
  AUTO: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Auto.png",
  MANUAL: "https://testingcf.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/select.png",
  GLOBAL: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png",
  AD: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/AdBlack.png",
  CLEAN: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hijacking.png",
  FINAL: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Final.png",
  AI: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/AI.png"
};

const REGIONS = [
  { name: "香港节点", icon: ICONS.HK, filter: "(?i)港|HK|hk|Hong Kong|HongKong" },
  { name: "日本节点", icon: ICONS.JP, filter: "(?i)日本|东京|大阪|埼玉|JP|Japan" },
  { name: "美国节点", icon: ICONS.US, filter: "(?i)美|波特兰|达拉斯|俄勒冈|US|United States" },
  { name: "狮城节点", icon: ICONS.SG, filter: "(?i)新加坡|坡|狮城|SG|Singapore" },
  { name: "台湾节点", icon: ICONS.TW, filter: "(?i)台|新北|彰化|TW|Taiwan" }
];

const RULE_PROVIDERS_BASE = {
  "AI": "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/Ruleset/AI.list",
  "LocalAreaNetwork": "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/LocalAreaNetwork.list",
  "UnBan": "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/UnBan.list",
  "BanAD": "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/BanAD.list",
  "BanProgramAD": "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/BanProgramAD.list",
  "ProxyGFWlist": "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ProxyGFWlist.list",
  "ChinaDomain": "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ChinaDomain.list",
  "ChinaCompanyIp": "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ChinaCompanyIp.list",
  "Download": "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/Download.list"
};

/*
 * =================================================================
 * 2. 辅助工具 (Utilities)
 * =================================================================
 */

const safeRegex = (str) => {
  try {
    return new RegExp(str.replace(/\(\?i\)/g, ''), 'i');
  } catch (e) {
    return new RegExp(str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  }
};

const createGroup = (name, type, icon, proxies, extra = {}) => ({
  name, type, icon, proxies, ...extra
});

/*
 * =================================================================
 * 3. 核心处理 (Main)
 * =================================================================
 */

function main(config) {
  if (!config || !config.proxies) return config;

  // 1. 过滤节点
  const filterRegex = new RegExp(FILTER_KEYWORDS.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');
  const proxies = config.proxies.filter(p => !filterRegex.test(p.name));

  // 2. 识别有效地区
  const activeRegions = REGIONS.filter(r => proxies.some(p => safeRegex(r.filter).test(p.name)));
  const regionNames = activeRegions.map(r => r.name);
  
  const allRegionFilters = REGIONS.map(r => r.filter.replace(/\(\?i\)/g, '')).join('|');
  const hasOtherNodes = proxies.some(p => !new RegExp(allRegionFilters, 'i').test(p.name));
  
  // 3. 构建基础节点池 (这是所有 UI 下拉菜单的基础)
  // 注意：这里不再放入 "自动选择"，由各分组根据需要自行添加
  const baseNodePool = [...regionNames];
  if (hasOtherNodes) baseNodePool.push("其他节点");
  baseNodePool.push("手动切换", "DIRECT");

  // 4. 构造代理组
  const proxyGroups = [
    // 核心出口：手动切换和自动选择作为首选
    createGroup("节点选择", "select", ICONS.PROXY, ["自动选择", ...baseNodePool]),
    
    // 全局自动：对所有节点进行延迟测试
    createGroup("自动选择", "url-test", ICONS.AUTO, [], { "include-all": true, interval: 300, tolerance: 50 }),
    
    // 手动切换：展示所有节点的单选列表
    createGroup("手动切换", "select", ICONS.MANUAL, [], { "include-all": true }),

    // AI 分组：默认可以使用地区组或全局自动
    createGroup("AI节点", "select", ICONS.AI, ["自动选择", ...baseNodePool]),

    // 动态地区组
    ...activeRegions.map(r => createGroup(r.name, "url-test", r.icon, [], { 
      "include-all": true, 
      filter: r.filter, 
      interval: 300 
    })),

    // 其他节点
    ...(hasOtherNodes ? [
      createGroup("其他节点", "url-test", ICONS.GLOBAL, [], {
        "include-all": true,
        "exclude-filter": allRegionFilters
      })
    ] : []),

    createGroup("广告拦截", "select", ICONS.AD, ["REJECT", "DIRECT"]),
    createGroup("应用净化", "select", ICONS.CLEAN, ["REJECT", "DIRECT"]),
    
    // 漏网之鱼
    createGroup("漏网之鱼", "select", ICONS.FINAL, ["节点选择", "自动选择", "AI节点", ...baseNodePool]),
    
    // GLOBAL (Verge 界面有时会直接显示这个)
    createGroup("GLOBAL", "select", ICONS.GLOBAL, ["节点选择", "自动选择", "AI节点", "广告拦截", "漏网之鱼"])
  ];

  // 5. 注入配置
  config.proxies = proxies;
  config["proxy-groups"] = proxyGroups;

  // 6. 注入 Rule Providers
  config["rule-providers"] = Object.fromEntries(
    Object.entries(RULE_PROVIDERS_BASE).map(([name, url]) => [
      name, 
      {
        type: "http",
        behavior: (name === "ChinaDomain") ? "domain" : (name === "ChinaCompanyIp" ? "ipcidr" : "classical"),
        url: url,
        path: `./ruleset/${name}.list`,
        interval: 86400,
        format: "text"
      }
    ])
  );

  // 7. 规则
  config["rules"] = [
    "RULE-SET,LocalAreaNetwork,DIRECT",
    "RULE-SET,UnBan,DIRECT",
    "RULE-SET,AI,AI节点",
    "RULE-SET,BanAD,广告拦截",
    "RULE-SET,BanProgramAD,应用净化",
    "RULE-SET,ProxyGFWlist,节点选择",
    "RULE-SET,ChinaDomain,DIRECT",
    "RULE-SET,ChinaCompanyIp,DIRECT",
    "RULE-SET,Download,DIRECT",
    "DOMAIN-SUFFIX,cloudflare.com,节点选择",
    "DOMAIN-SUFFIX,anlu.fun,节点选择",
    "DOMAIN-SUFFIX,linux.do,节点选择",
    "GEOIP,CN,DIRECT",
    "MATCH,漏网之鱼"
  ];

  return config;
}
