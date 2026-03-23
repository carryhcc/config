// 规则集配置
const RULES_CONFIG = [
  "RULE-SET,LocalAreaNetwork,DIRECT",
  "RULE-SET,UnBan,DIRECT",
  "RULE-SET,BanAD,广告拦截",
  "RULE-SET,BanProgramAD,应用净化",
  "RULE-SET,ProxyGFWlist,节点选择",
  "RULE-SET,ChinaDomain,DIRECT",
  "RULE-SET,ChinaCompanyIp,DIRECT",
  "RULE-SET,Download,DIRECT",
  "RULE-SET,AI,AI节点",
  "DOMAIN-SUFFIX,cloudflare.com,节点选择",
  "DOMAIN-SUFFIX,googleapis.com,节点选择",
  "DOMAIN-SUFFIX,antigravity.google,节点选择",
  "GEOIP,CN,DIRECT",
  "MATCH,漏网之鱼"
];

// 规则提供者
const RULE_PROVIDERS_CONFIG = {
  LocalAreaNetwork: { url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/LocalAreaNetwork.list", path: "./ruleset/LocalAreaNetwork.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
  UnBan: { url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/UnBan.list", path: "./ruleset/UnBan.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
  BanAD: { url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/BanAD.list", path: "./ruleset/BanAD.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
  BanProgramAD: { url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/BanProgramAD.list", path: "./ruleset/BanProgramAD.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
  ProxyGFWlist: { url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ProxyGFWlist.list", path: "./ruleset/ProxyGFWlist.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
  ChinaDomain: { url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ChinaDomain.list", path: "./ruleset/ChinaDomain.list", behavior: "domain", interval: 86400, format: "text", type: "http" },
  ChinaCompanyIp: { url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ChinaCompanyIp.list", path: "./ruleset/ChinaCompanyIp.list", behavior: "ipcidr", interval: 86400, format: "text", type: "http" },
  Download: { url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/Download.list", path: "./ruleset/Download.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
  AI: { url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/Ruleset/AI.list", path: "./ruleset/AI.list", behavior: "classical", interval: 86400, format: "text", type: "http" }
};

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
  AD_BLACK: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/AdBlack.png",
  HIJACKING: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hijacking.png",
  FINAL: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Final.png",
  AI: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/AI.png",
  SAVING: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Brown.png"
};

const FILTER_KEYWORDS = ['群', '邀请', '返利', '循环', '官网', '客服', '网站', '网址', '获取', '订阅', '流量', '到期', '机场', '下次', '版本', '官址', '备用', '过期', '已用', '联系', '邮箱', '工单', '贩卖', '通知', '倒卖', '防止', '国内', '建议', '地址', '频道', '无法', '说明', '使用', '提示', '特别', '访问', '支持', '10x', '8x', '6x'];

const REGION_FILTERS = {
  "美国节点": { icon: ICONS.US, filter: "(?i)美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|US|United States" },
  "日本节点": { icon: ICONS.JP, filter: "(?i)日本|川日|东京|大阪|泉日|埼玉|沪日|深日|JP|Japan" },
  "狮城节点": { icon: ICONS.SG, filter: "(?i)新加坡|坡|狮城|SG|Singapore" },
  "香港节点": { icon: ICONS.HK, filter: "(?i)港|HK|hk|Hong Kong|HongKong|hongkong" },
  "台湾节点": { icon: ICONS.TW, filter: "(?i)台|新北|彰化|TW|Taiwan" }
};

const KEYWORD_REGEXP = new RegExp(FILTER_KEYWORDS.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');


// --- 移除字符串中的 Emoji（包括国旗符号） ---
function removeEmoji(str) {
  if (!str) return str;
  const emojiRegex = /[\u{1F1E6}-\u{1F1FF}]{2}|[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27BF}]/gu;
  return str.replace(emojiRegex, '').trim();
}

function main(config) {
  if (!config || !Array.isArray(config.proxies)) return config;

  // --- 修改处：过滤关键字并移除节点名称中的 Emoji ---
  const filteredProxies = config.proxies
    .filter(p => p && p.name && !KEYWORD_REGEXP.test(p.name))
    .map(p => {
      p.name = removeEmoji(p.name);
      return p;
    });

  const activeRegions = [];
  const regionSpecs = Object.entries(REGION_FILTERS).map(([name, cfg]) => {
    const cleanPattern = cfg.filter.replace(/\(\?i\)/g, '');
    const regex = new RegExp(cleanPattern, 'i');
    if (filteredProxies.some(p => regex.test(p.name))) activeRegions.push(name);
    return { name, icon: cfg.icon, rawFilter: cfg.filter, regex };
  });

  const hasOtherNodes = filteredProxies.some(p => !regionSpecs.some(spec => spec.regex.test(p.name)));

  const groups = [];

  // --- 核心主组 ---
  groups.push({
    name: "节点选择",
    type: "select",
    icon: ICONS.PROXY,
    proxies: ["自动选择", "省流节点", "手动切换", "AI节点", ...activeRegions, ...(hasOtherNodes ? ["其他节点"] : []), "DIRECT"]
  });

  // --- 省流节点 ---
  groups.push({
    name: "省流节点",
    type: "url-test",
    icon: ICONS.SAVING,
    interval: 300,
    tolerance: 50,
    "include-all": true,
    "exclude-filter": "(?i)10x|9x|8x|7x|6x|5x|4x|3x|2x"
  });

  groups.push({ name: "自动选择", type: "url-test", icon: ICONS.AUTO, interval: 300, tolerance: 50, "include-all": true });
  groups.push({ name: "手动切换", type: "select", icon: ICONS.MANUAL, "include-all": true });

  // 地区组
  regionSpecs.forEach(r => {
    if (activeRegions.includes(r.name)) {
      groups.push({ name: r.name, type: "url-test", icon: r.icon, interval: 300, tolerance: 50, "include-all": true, filter: r.rawFilter });
    }
  });

  // AI 节点组
  groups.push({
    name: "AI节点",
    type: "select",
    icon: ICONS.AI,
    "include-all": true,
    filter: "(?i)^(?!.*(港|HK|Hong Kong|CN|中国)).*(美|US|Japan|日本|SG|新加坡|坡|TW|台湾)",
    proxies: ["自动选择", "省流节点", ...activeRegions]
  });

  // 其他节点
  if (hasOtherNodes) {
    const excludePattern = regionSpecs.map(r => r.rawFilter.replace(/\(\?i\)/g, '')).join('|');
    groups.push({ name: "其他节点", type: "url-test", icon: ICONS.GLOBAL, interval: 300, "include-all": true, "exclude-filter": excludePattern });
  }

  // 功能组
  groups.push({ name: "广告拦截", type: "select", icon: ICONS.AD_BLACK, proxies: ["REJECT", "DIRECT"] });
  groups.push({ name: "应用净化", type: "select", icon: ICONS.HIJACKING, proxies: ["REJECT", "DIRECT"] });
  groups.push({ name: "漏网之鱼", type: "select", icon: ICONS.FINAL, proxies: ["节点选择", "省流节点", "自动选择", "DIRECT"] });

  // 全局组
  groups.push({
    name: "GLOBAL",
    type: "select",
    icon: ICONS.GLOBAL,
    "include-all": true,
    proxies: ["节点选择", "省流节点", "AI节点", "广告拦截", "漏网之鱼"]
  });

  config.proxies = filteredProxies;
  config["proxy-groups"] = groups;
  config["rule-providers"] = RULE_PROVIDERS_CONFIG;
  config["rules"] = RULES_CONFIG;

  return config;
}
