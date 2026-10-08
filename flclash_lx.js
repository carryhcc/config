/*
 * =================================================================
 * FlClash / Mihomo 完整覆写脚本
 * =================================================================
 *
 * 功能：
 * 1. 节点自动测速
 * 2. 0.1x 省流节点自动测速
 * 3. 美国 / 日本 / 新加坡 / 香港 / 台湾地区分组
 * 4. AI 节点分组
 * 5. 广告拦截 / 应用净化
 * 6. DNS Fake-IP
 * 7. 国内 / 国外 DNS 分流
 * 8. NTP 时间同步
 * 9. 避免 invalid group
 *
 * =================================================================
 */


/*
 * =================================================================
 * 1. 规则集
 * =================================================================
 */

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
  "DOMAIN-SUFFIX,anlu.fun,节点选择",
  "DOMAIN-SUFFIX,linux.do,节点选择",
  "DOMAIN-SUFFIX,googleapis.com,节点选择",
  "DOMAIN-SUFFIX,antigravity.google,节点选择",

  "GEOIP,CN,DIRECT",

  "MATCH,漏网之鱼"
];


/*
 * =================================================================
 * 2. Rule Providers
 * =================================================================
 */

const RULE_PROVIDERS_CONFIG = {

  LocalAreaNetwork: {
    url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/LocalAreaNetwork.list",
    path: "./ruleset/LocalAreaNetwork.list",
    behavior: "classical",
    interval: 86400,
    format: "text",
    type: "http"
  },

  UnBan: {
    url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/UnBan.list",
    path: "./ruleset/UnBan.list",
    behavior: "classical",
    interval: 86400,
    format: "text",
    type: "http"
  },

  BanAD: {
    url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/BanAD.list",
    path: "./ruleset/BanAD.list",
    behavior: "classical",
    interval: 86400,
    format: "text",
    type: "http"
  },

  BanProgramAD: {
    url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/BanProgramAD.list",
    path: "./ruleset/BanProgramAD.list",
    behavior: "classical",
    interval: 86400,
    format: "text",
    type: "http"
  },

  ProxyGFWlist: {
    url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ProxyGFWlist.list",
    path: "./ruleset/ProxyGFWlist.list",
    behavior: "classical",
    interval: 86400,
    format: "text",
    type: "http"
  },

  ChinaDomain: {
    url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ChinaDomain.list",
    path: "./ruleset/ChinaDomain.list",
    behavior: "domain",
    interval: 86400,
    format: "text",
    type: "http"
  },

  ChinaCompanyIp: {
    url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ChinaCompanyIp.list",
    path: "./ruleset/ChinaCompanyIp.list",
    behavior: "ipcidr",
    interval: 86400,
    format: "text",
    type: "http"
  },

  Download: {
    url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/Download.list",
    path: "./ruleset/Download.list",
    behavior: "classical",
    interval: 86400,
    format: "text",
    type: "http"
  },

  AI: {
    url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/Ruleset/AI.list",
    path: "./ruleset/AI.list",
    behavior: "classical",
    interval: 86400,
    format: "text",
    type: "http"
  }
};


/*
 * =================================================================
 * 3. 图标
 * =================================================================
 */

const ICONS = {

  US:
    "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_States.png",

  JP:
    "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Japan.png",

  SG:
    "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Singapore.png",

  HK:
    "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hong_Kong.png",

  TW:
    "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Taiwan.png",

  PROXY:
    "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Proxy.png",

  AUTO:
    "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Auto.png",

  MANUAL:
    "https://testingcf.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/select.png",

  GLOBAL:
    "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png",

  AD_BLACK:
    "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/AdBlack.png",

  HIJACKING:
    "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hijacking.png",

  FINAL:
    "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Final.png",

  AI:
    "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/AI.png",

  SAVING:
    "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Cloud_Download.png"
};


/*
 * =================================================================
 * 4. 节点过滤
 * =================================================================
 */

const FILTER_KEYWORDS = [
  "群",
  "邀请",
  "返利",
  "循环",
  "官网",
  "客服",
  "网站",
  "网址",
  "获取",
  "订阅",
  "流量",
  "到期",
  "机场",
  "下次",
  "版本",
  "官址",
  "备用",
  "过期",
  "已用",
  "联系",
  "邮箱",
  "工单",
  "贩卖",
  "通知",
  "倒卖",
  "地址",
  "频道"
];

const KEYWORD_REGEXP = new RegExp(
  FILTER_KEYWORDS
    .map(s =>
      s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    )
    .join("|"),
  "i"
);


/*
 * =================================================================
 * 5. 地区过滤
 * =================================================================
 */

const REGION_FILTERS = {

  "美国节点": {
    icon: ICONS.US,

    filter:
      "(?i)(美国|美國|US|USA|United States|UnitedStates|洛杉矶|洛杉磯|Los Angeles|圣何塞|聖何塞|San Jose|纽约|紐約|New York|西雅图|西雅圖|Seattle|芝加哥|Chicago|达拉斯|達拉斯|Dallas|波特兰|波特蘭|Portland|凤凰城|鳳凰城|Phoenix|硅谷|Silicon Valley)"
  },

  "日本节点": {
    icon: ICONS.JP,

    filter:
      "(?i)(日本|JP|Japan|东京|東京|Tokyo|大阪|Osaka|埼玉|Saitama|名古屋|Nagoya|福冈|福岡|Fukuoka)"
  },

  "狮城节点": {
    icon: ICONS.SG,

    filter:
      "(?i)(新加坡|SG|Singapore|狮城|獅城)"
  },

  "香港节点": {
    icon: ICONS.HK,

    filter:
      "(?i)(香港|HK|Hong Kong|HongKong|Hong-Kong)"
  },

  "台湾节点": {
    icon: ICONS.TW,

    filter:
      "(?i)(台湾|臺灣|TW|Taiwan|台北|臺北|Taipei|新北|New Taipei|彰化|Changhua)"
  }
};


/*
 * =================================================================
 * 6. 测速参数
 * =================================================================
 */

const TEST_URL =
  "https://www.gstatic.com/generate_204";

const TEST_INTERVAL = 1800;

const TEST_TOLERANCE = 50;


/*
 * =================================================================
 * 7. 工具函数
 * =================================================================
 */

function unique(list) {

  return [...new Set(list)];

}


function getProxyNames(list) {

  return list
    .filter(
      p =>
        p &&
        p.name
    )
    .map(
      p =>
        p.name
    );

}


function matchNodes(nodes, regex) {

  return nodes.filter(
    name =>
      regex.test(name)
  );

}


/*
 * =================================================================
 * 8. 主函数
 * =================================================================
 */

function main(config) {

  if (
    !config ||
    !Array.isArray(config.proxies)
  ) {

    return config;

  }


  /*
   * ---------------------------------------------------------------
   * 8.1 过滤节点
   * ---------------------------------------------------------------
   */

  const filteredProxies =
    config.proxies.filter(
      p =>
        p &&
        p.name &&
        !KEYWORD_REGEXP.test(p.name)
    );


  /*
   * 所有真实节点
   */

  const ALL_NODES =
    unique(
      getProxyNames(
        filteredProxies
      )
    );


  /*
   * ---------------------------------------------------------------
   * 8.2 地区节点
   * ---------------------------------------------------------------
   */

  const regionSpecs =
    Object.entries(
      REGION_FILTERS
    )
    .map(
      ([name, cfg]) => {

        const pattern =
          cfg.filter.replace(
            /\(\?i\)/g,
            ""
          );

        const regex =
          new RegExp(
            pattern,
            "i"
          );

        const nodes =
          matchNodes(
            ALL_NODES,
            regex
          );

        return {

          name,

          icon:
            cfg.icon,

          regex,

          nodes

        };

      }
    );


  /*
   * ---------------------------------------------------------------
   * 8.3 有效地区
   * ---------------------------------------------------------------
   */

  const activeRegions =
    regionSpecs
      .filter(
        region =>
          region.nodes.length > 0
      )
      .map(
        region =>
          region.name
      );


  /*
   * ---------------------------------------------------------------
   * 8.4 其他节点
   * ---------------------------------------------------------------
   */

  const categorizedNodes =
    new Set();

  regionSpecs.forEach(
    region => {

      region.nodes.forEach(
        node =>
          categorizedNodes.add(node)
      );

    }
  );


  const otherNodes =
    ALL_NODES.filter(
      node =>
        !categorizedNodes.has(node)
    );


  /*
   * ---------------------------------------------------------------
   * 8.5 0.1x 省流节点
   * ---------------------------------------------------------------
   */

  const savingRegex =
    /0\.1x/i;

  const savingNodes =
    ALL_NODES.filter(
      node =>
        savingRegex.test(node)
    );


  /*
   * ---------------------------------------------------------------
   * 8.6 AI 节点
   *
   * 排除：
   * 香港
   * 中国大陆
   *
   * 允许：
   * 美国
   * 日本
   * 新加坡
   * 台湾
   * ---------------------------------------------------------------
   */

  const aiAllowRegex =
    /(?:美国|美國|US|USA|United States|UnitedStates|日本|JP|Japan|新加坡|SG|Singapore|狮城|獅城|台湾|臺灣|TW|Taiwan|台北|臺北|Taipei)/i;

  const aiExcludeRegex =
    /(?:香港|HK|Hong Kong|HongKong|中国|中國|CN|China)/i;

  const aiNodes =
    ALL_NODES.filter(
      node =>
        aiAllowRegex.test(node) &&
        !aiExcludeRegex.test(node)
    );


  /*
   * =================================================================
   * 9. 代理组
   * =================================================================
   */

  const groups = [];


  /*
   * ---------------------------------------------------------------
   * 9.1 自动选择
   * ---------------------------------------------------------------
   */

  if (
    ALL_NODES.length > 0
  ) {

    groups.push({

      name:
        "自动选择",

      type:
        "url-test",

      icon:
        ICONS.AUTO,

      proxies:
        ALL_NODES,

      url:
        TEST_URL,

      interval:
        TEST_INTERVAL,

      tolerance:
        TEST_TOLERANCE

    });

  }


  /*
   * ---------------------------------------------------------------
   * 9.2 省流节点
   * ---------------------------------------------------------------
   */

  if (
    savingNodes.length > 0
  ) {

    groups.push({

      name:
        "省流节点",

      type:
        "url-test",

      icon:
        ICONS.SAVING,

      proxies:
        savingNodes,

      url:
        TEST_URL,

      interval:
        TEST_INTERVAL,

      tolerance:
        TEST_TOLERANCE

    });

  }


  /*
   * ---------------------------------------------------------------
   * 9.3 手动切换
   * ---------------------------------------------------------------
   */

  if (
    ALL_NODES.length > 0
  ) {

    groups.push({

      name:
        "手动切换",

      type:
        "select",

      icon:
        ICONS.MANUAL,

      proxies:
        ALL_NODES

    });

  }


  /*
   * ---------------------------------------------------------------
   * 9.4 地区节点
   * ---------------------------------------------------------------
   */

  regionSpecs.forEach(
    region => {

      if (
        region.nodes.length === 0
      ) {

        return;

      }


      groups.push({

        name:
          region.name,

        type:
          "url-test",

        icon:
          region.icon,

        proxies:
          region.nodes,

        url:
          TEST_URL,

        interval:
          TEST_INTERVAL,

        tolerance:
          TEST_TOLERANCE

      });

    }
  );


  /*
   * ---------------------------------------------------------------
   * 9.5 AI 节点
   * ---------------------------------------------------------------
   */

  const aiGroupProxies = [];


  /*
   * 自动选择
   */

  if (
    ALL_NODES.length > 0
  ) {

    aiGroupProxies.push(
      "自动选择"
    );

  }


  /*
   * AI 地区组
   *
   * 不包含香港
   */

  [
    "美国节点",
    "日本节点",
    "狮城节点",
    "台湾节点"
  ]
  .forEach(
    name => {

      if (
        activeRegions.includes(name)
      ) {

        aiGroupProxies.push(
          name
        );

      }

    }
  );


  /*
   * 没有可用节点时，
   * 至少保证代理组合法
   */

  if (
    aiGroupProxies.length === 0
  ) {

    aiGroupProxies.push(
      "DIRECT"
    );

  }


  groups.push({

    name:
      "AI节点",

    type:
      "select",

    icon:
      ICONS.AI,

    proxies:
      unique(
        aiGroupProxies
      )

  });


  /*
   * ---------------------------------------------------------------
   * 9.6 其他节点
   * ---------------------------------------------------------------
   */

  if (
    otherNodes.length > 0
  ) {

    groups.push({

      name:
        "其他节点",

      type:
        "url-test",

      icon:
        ICONS.GLOBAL,

      proxies:
        otherNodes,

      url:
        TEST_URL,

      interval:
        TEST_INTERVAL,

      tolerance:
        TEST_TOLERANCE

    });

  }


  /*
   * ---------------------------------------------------------------
   * 9.7 广告拦截
   * ---------------------------------------------------------------
   */

  groups.push({

    name:
      "广告拦截",

    type:
      "select",

    icon:
      ICONS.AD_BLACK,

    proxies: [
      "REJECT",
      "DIRECT"
    ]

  });


  /*
   * ---------------------------------------------------------------
   * 9.8 应用净化
   * ---------------------------------------------------------------
   */

  groups.push({

    name:
      "应用净化",

    type:
      "select",

    icon:
      ICONS.HIJACKING,

    proxies: [
      "REJECT",
      "DIRECT"
    ]

  });


  /*
   * ---------------------------------------------------------------
   * 9.9 节点选择
   * ---------------------------------------------------------------
   */

  const nodeSelectProxies = [];


  if (
    ALL_NODES.length > 0
  ) {

    nodeSelectProxies.push(
      "自动选择"
    );

  }


  if (
    savingNodes.length > 0
  ) {

    nodeSelectProxies.push(
      "省流节点"
    );

  }


  if (
    ALL_NODES.length > 0
  ) {

    nodeSelectProxies.push(
      "手动切换"
    );

  }


  nodeSelectProxies.push(
    "AI节点"
  );


  activeRegions.forEach(
    region => {

      nodeSelectProxies.push(
        region
      );

    }
  );


  if (
    otherNodes.length > 0
  ) {

    nodeSelectProxies.push(
      "其他节点"
    );

  }


  nodeSelectProxies.push(
    "DIRECT"
  );


  groups.push({

    name:
      "节点选择",

    type:
      "select",

    icon:
      ICONS.PROXY,

    proxies:
      unique(
        nodeSelectProxies
      )

  });


  /*
   * ---------------------------------------------------------------
   * 9.10 漏网之鱼
   * ---------------------------------------------------------------
   */

  const finalProxies = [
    "节点选择"
  ];


  if (
    savingNodes.length > 0
  ) {

    finalProxies.push(
      "省流节点"
    );

  }


  if (
    ALL_NODES.length > 0
  ) {

    finalProxies.push(
      "自动选择"
    );

  }


  finalProxies.push(
    "DIRECT"
  );


  groups.push({

    name:
      "漏网之鱼",

    type:
      "select",

    icon:
      ICONS.FINAL,

    proxies:
      unique(
        finalProxies
      )

  });


  /*
   * ---------------------------------------------------------------
   * 9.11 GLOBAL
   * ---------------------------------------------------------------
   */

  groups.push({

    name:
      "GLOBAL",

    type:
      "select",

    icon:
      ICONS.GLOBAL,

    proxies: [
      "节点选择",

      ...(savingNodes.length > 0
        ? ["省流节点"]
        : []),

      "AI节点",

      "广告拦截",

      "漏网之鱼"
    ]

  });


  /*
   * =================================================================
   * 10. DNS
   * =================================================================
   *
   * Fake-IP 模式
   *
   * 国内：
   *   阿里 DNS
   *   腾讯 DNS
   *
   * 国外：
   *   Cloudflare DoH
   *   Google DoH
   *
   * =================================================================
   */

  config.dns = {

    /*
     * 开启 DNS
     */

    enable:
      true,


    /*
     * IPv6
     *
     * Android + 代理环境下，
     * 没有稳定 IPv6 时关闭更稳。
     */

    ipv6:
      false,


    /*
     * Fake-IP
     */

    "enhanced-mode":
      "fake-ip",


    /*
     * Fake-IP 地址池
     */

    "fake-ip-range":
      "198.18.0.1/16",


    /*
     * 不进行 Fake-IP 的域名
     *
     * 重点保护：
     *
     * - 局域网
     * - localhost
     * - Windows 网络检测
     * - NTP
     * - 本地 Home 网络
     */

    "fake-ip-filter": [

      "*.lan",

      "*.local",

      "*.localhost",

      "localhost",

      "localhost.ptlogin2.qq.com",

      "+.msftconnecttest.com",

      "+.msftncsi.com",

      "time.*.com",

      "time.*.gov",

      "time.*.edu.cn",

      "time.apple.com",

      "time.windows.com",

      "pool.ntp.org",

      "time.nist.gov",

      "*.home.arpa"
    ],


    /*
     * ===============================================================
     * 国内 DNS
     * ===============================================================
     */

    nameserver: [

      "223.5.5.5",

      "119.29.29.29"
    ],


    /*
     * ===============================================================
     * 国外 DNS
     * ===============================================================
     *
     * 使用 DoH。
     */

    fallback: [

      "https://1.1.1.1/dns-query",

      "https://8.8.8.8/dns-query"
    ],


    /*
     * ===============================================================
     * DNS Fallback 判断
     * ===============================================================
     */

    "fallback-filter": {

      /*
       * GEOIP 判断
       */

      geoip:
        true,

      "geoip-code":
        "CN",


      /*
       * 异常 IP
       */

      ipcidr: [

        "240.0.0.0/4",

        "0.0.0.0/32",

        "127.0.0.0/8"
      ]
    }
  };


  /*
   * =================================================================
   * 11. NTP
   * =================================================================
   */

  config.ntp = {

    enable:
      true,

    server:
      "time.apple.com",

    port:
      123,

    interval:
      3600,

    "write-to-system":
      false
  };


  /*
   * =================================================================
   * 12. 写入配置
   * =================================================================
   */

  config.proxies =
    filteredProxies;

  config["proxy-groups"] =
    groups;

  config["rule-providers"] =
    RULE_PROVIDERS_CONFIG;

  config["rules"] =
    RULES_CONFIG;


  /*
   * =================================================================
   * 13. 返回
   * =================================================================
 */

  return config;
}
