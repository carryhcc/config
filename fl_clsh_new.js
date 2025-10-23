/*
 * =================================================================
 * 辅助函数 (Helpers)
 * =================================================================
 */

/**
 * 安全地转义用于正则表达式的字符串。
 * @param {string} s 要转义的字符串
 * @returns {string} 转义后的字符串
 */
const escapeForRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * 编译正则表达式，并提供回退机制。
 * @param {string} pattern 原始正则字符串 (可能包含 (?i))
 * @returns {RegExp} 编译后的 RegExp 对象
 */
function compileRegex(pattern) {
  // 移除 JS 不支持的 (?i) 内联标志，我们将使用 'i' flag 代替
  const cleanPattern = String(pattern || '').replace(/\(\?i\)/g, '');
  try {
    return new RegExp(cleanPattern, 'i');
  } catch (e) {
    console.warn(`无效的正则表达式: "${pattern}". 已回退到安全匹配。`);
    // 回退：按 '|' 分割，转义每个部分，然后重新组合
    const safePattern = cleanPattern
      .split('|')
      .map(escapeForRegex)
      .join('|');
    return new RegExp(safePattern, 'i');
  }
}

/**
 * 创建一个标准的 URL-TEST 代理组。
 * @param {string} name 组名
 * @param {string} icon 图标 URL
 * @param {object} props 额外的属性 (例如 "include-all", "filter", "exclude-filter")
 * @returns {object} 代理组对象
 */
function createUrlTestGroup(name, icon, props) {
  return {
    name: name,
    icon: icon,
    type: "url-test",
    interval: 300,
    tolerance: 50,
    ...props
  };
}

/*
 * =================================================================
 * 静态配置数据 (Static Configuration Data)
 * =================================================================
 */

// 过滤关键词列表
const FILTER_KEYWORDS = [
  '群', '邀请', '返利', '循环', '官网', '客服', '网站', '网址', '获取',
  '订阅', '流量', '到期', '机场', '下次', '版本', '官址', '备用', '过期',
  '已用', '联系', '邮箱', '工单', '贩卖', '通知', '倒卖', '防止', '国内',
  '建议', '地址', '频道', '无法', '说明', '使用', '提示', '特别', '访问',
  '支持', '10x', '8x', '6x'
];

// 图标集 (统一管理)
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
  FINAL: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Final.png"
};

// 地区过滤规则
const REGION_FILTERS = {
  "美国节点": {
    icon: ICONS.US,
    filter: "(?i)美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|US|United States"
  },
  "日本节点": {
    icon: ICONS.JP,
    filter: "(?i)日本|川日|东京|大阪|泉日|埼玉|沪日|深日|JP|Japan"
  },
  "狮城节点": {
    icon: ICONS.SG,
    filter: "(?i)新加坡|坡|狮城|SG|Singapore"
  },
  "香港节点": {
    icon: ICONS.HK,
    filter: "(?i)港|HK|hk|Hong Kong|HongKong|hongkong"
  },
  "台湾节点": {
    icon: ICONS.TW,
    filter: "(?i)台|新北|彰化|TW|Taiwan"
  }
};

// 规则提供者
const RULE_PROVIDERS_CONFIG = {
  LocalAreaNetwork: {
    url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/LocalAreaNetwork.list",
    path: "./ruleset/LocalAreaNetwork.list", behavior: "classical", interval: 86400, format: "text", type: "http"
  },
  UnBan: {
    url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/UnBan.list",
    path: "./ruleset/UnBan.list", behavior: "classical", interval: 86400, format: "text", type: "http"
  },
  BanAD: {
    url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/BanAD.list",
    path: "./ruleset/BanAD.list", behavior: "classical", interval: 86400, format: "text", type: "http"
  },
  BanProgramAD: {
    url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/BanProgramAD.list",
    path: "./ruleset/BanProgramAD.list", behavior: "classical", interval: 86400, format: "text", type: "http"
  },
  ProxyGFWlist: {
    url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ProxyGFWlist.list",
    path: "./ruleset/ProxyGFWlist.list", behavior: "classical", interval: 86400, format: "text", type: "http"
  },
  ChinaDomain: {
    url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ChinaDomain.list",
    path: "./ruleset/ChinaDomain.list", behavior: "domain", interval: 86400, format: "text", type: "http"
  },
  ChinaCompanyIp: {
    url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ChinaCompanyIp.list",
    path: "./ruleset/ChinaCompanyIp.list", behavior: "ipcidr", interval: 86400, format: "text", type: "http"
  },
  Download: {
    url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/Download.list",
    path: "./ruleset/Download.list", behavior: "classical", interval: 86400, format: "text", type: "http"
  }
};

// 规则
const RULES_CONFIG = [
  "RULE-SET,LocalAreaNetwork,DIRECT",
  "RULE-SET,UnBan,DIRECT",
  "RULE-SET,BanAD,广告拦截",
  "RULE-SET,BanProgramAD,应用净化",
  "RULE-SET,ProxyGFWlist,节点选择",
  "RULE-SET,ChinaDomain,DIRECT",
  "RULE-SET,ChinaCompanyIp,DIRECT",
  "RULE-SET,Download,DIRECT",
  "GEOIP,CN,DIRECT",
  "MATCH,漏网之鱼"
];

/*
 * =================================================================
 * 核心处理函数 (Core Processing Functions)
 * =================================================================
 */

/**
 * 1. 按关键词过滤代理
 */
function filterProxiesByKeywords(proxies, keywords) {
  const keywordPattern = keywords.map(escapeForRegex).join('|');
  const keywordRegex = new RegExp(keywordPattern, 'i');

  return proxies.filter(p => {
    const name = p && typeof p.name === 'string' ? p.name : '';
    return !keywordRegex.test(name);
  });
}

/**
 * 2. 将代理分类到地区和“其他”
 * (性能优化：单次遍历)
 */
function classifyProxies(proxies, regionFilters) {
  const compiledFilters = [];
  const regionProxies = {};
  const availableRegions = [];
  const otherProxies = [];

  // 预编译正则，并初始化 regionProxies 映射
  for (const [regionName, regionConfig] of Object.entries(regionFilters)) {
    compiledFilters.push({
      name: regionName,
      regex: compileRegex(regionConfig.filter)
    });
    regionProxies[regionName] = [];
  }

  // 单次遍历进行分类
  for (const proxy of proxies) {
    const name = (proxy && proxy.name) || '';
    let matched = false;

    // 尝试匹配每个地区
    for (const filter of compiledFilters) {
      if (filter.regex.test(name)) {
        regionProxies[filter.name].push(proxy);
        matched = true;
        break;
      }
    }

    // 未匹配到任何地区
    if (!matched) {
      otherProxies.push(proxy);
    }
  }

  // 检查哪些地区真的有节点
  for (const [regionName, proxies] of Object.entries(regionProxies)) {
    if (proxies.length > 0) {
      availableRegions.push(regionName);
    }
  }

  return {
    availableRegions,
    regionProxies,
    otherProxies,
    hasOtherNodes: otherProxies.length > 0
  };
}

/**
 * 3. 构建代理组
 */
function buildProxyGroups(classification, regionFilters, icons) {
  const { availableRegions, hasOtherNodes } = classification;
  const proxyGroups = [];

  // --- 动态构建代理列表 ---
  const nodeSelectionProxies = [
    ...availableRegions,
    ...(hasOtherNodes ? ["其他节点"] : []),
    "自动选择", "手动切换", "DIRECT"
  ];

  const finalProxies = [
    "节点选择",
    ...availableRegions,
    ...(hasOtherNodes ? ["其他节点"] : []),
    "自动选择", "手动切换", "DIRECT"
  ];

  const globalProxies = [
    "节点选择", "自动选择", "手动切换",
    ...availableRegions,
    ...(hasOtherNodes ? ["其他节点"] : []),
    "广告拦截", "应用净化", "漏网之鱼"
  ];

  // --- 1. 核心选择组 ---
  proxyGroups.push({
    name: "节点选择",
    icon: icons.PROXY,
    type: "select",
    proxies: nodeSelectionProxies
  });

  proxyGroups.push(createUrlTestGroup("自动选择", icons.AUTO, {
    "include-all": true
  }));

  proxyGroups.push({
    name: "手动切换",
    icon: icons.MANUAL,
    "include-all": true,
    type: "select"
  });

  // --- 2. 地区分组 ---
  for (const regionName of availableRegions) {
    const regionConfig = regionFilters[regionName];
    proxyGroups.push(createUrlTestGroup(regionName, regionConfig.icon, {
      "include-all": true,
      filter: regionConfig.filter // 使用原始 filter 字符串
    }));
  }

  // --- 3. 其他节点组 ---
  if (hasOtherNodes) {
    // 构建 "exclude-filter" 所需的联合正则字符串
    const excludePattern = Object.values(regionFilters)
      .map(r => String(r.filter || '').replace(/\(\?i\)/g, ''))
      .join('|');
      
    proxyGroups.push(createUrlTestGroup("其他节点", icons.GLOBAL, {
      "include-all": true,
      "exclude-filter": excludePattern
    }));
  }

  // --- 4. 功能性分组 ---
  proxyGroups.push({
    name: "广告拦截",
    icon: icons.AD_BLACK,
    type: "select",
    proxies: ["REJECT", "DIRECT"]
  });

  proxyGroups.push({
    name: "应用净化",
    icon: icons.HIJACKING,
    type: "select",
    proxies: ["REJECT", "DIRECT"]
  });

  proxyGroups.push({
    name: "漏网之鱼",
    icon: icons.FINAL,
    type: "select",
    proxies: finalProxies
  });

  proxyGroups.push({
    name: "GLOBAL",
    icon: icons.GLOBAL,
    "include-all": true,
    type: "select",
    proxies: globalProxies
  });

  return proxyGroups;
}


/*
 * =================================================================
 * 主函数 (Main Function)
 * =================================================================
 */

/**
 * Clash 配置预处理器
 * @param {object} config 传入的原始配置对象
 * @returns {object} 处理后的配置对象
 */
function main(config) {
  // 1. 基本验证
  if (!config || typeof config !== 'object') return config;

  const allProxies = Array.isArray(config.proxies) ? config.proxies : [];

  // 2. 步骤 1: 按关键词过滤代理
  const filteredProxies = filterProxiesByKeywords(allProxies, FILTER_KEYWORDS);

  // 3. 步骤 2: 将代理分类
  const classification = classifyProxies(filteredProxies, REGION_FILTERS);

  // 4. 步骤 3: 构建代理组
  const proxyGroups = buildProxyGroups(classification, REGION_FILTERS, ICONS);

  // 5. 更新 config
  config.proxies = filteredProxies;        // 使用过滤后的代理列表
  config["proxy-groups"] = proxyGroups;   // 使用新生成的代理组
  config["rule-providers"] = RULE_PROVIDERS_CONFIG; // 应用规则提供者
  config["rules"] = RULES_CONFIG;         // 应用规则

  // 6. 返回修改后的配置
  return config;
}
