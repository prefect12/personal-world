export const profile={name:'Kade Wu',role:'Backend Engineer',github:'https://github.com/prefect12',linkedin:'https://www.linkedin.com/in/kadewu/'};
const tech=items=>`<div class="tech-list">${items.map(t=>`<span>${t}</span>`).join('')}</div>`;
export const pages={
 about:{label:'关于 Kade',index:'01 / 起点',title:'你好，我是 Kade。',body:`<p class="lead">用代码连接想法与现实。</p><p>我是一名后端工程师，主要使用 Golang 和 Python，关注广告交易、达人匹配、分布式系统与工程自动化。</p><p>从自动化测试到广告平台，再到达人匹配服务，我喜欢把复杂的问题拆开，做成能够稳定运行的系统。</p>${tech(['Golang','Python','Distributed Systems'])}`},
 ahalab:{label:'AhaLab',index:'02 / 2023 起',title:'让匹配发生。',body:`<p class="lead">Backend Engineer · AhaLab</p><p>参与达人匹配系统的核心服务开发，围绕广告业务与创作者匹配构建后端能力。</p><div class="content-item"><h3>Influencer Match Service</h3><p>开发广告系统核心服务与达人匹配服务，使用 Golang、Python，以及云服务、数据库和消息队列。</p></div>${tech(['Golang','Python','AWS','MongoDB','Redis','Kafka','Serverless'])}`},
 liftoff:{label:'Liftoff',index:'03 / 2022 — 2023',title:'每一次请求背后。',body:`<p class="lead">Platform Backend Engineer · Liftoff</p><p>负责广告系统核心 Ad Exchange 服务的开发与维护，处理大量广告请求，维护并开发 RESTful 接口。</p><div class="content-item"><h3>可观测的服务</h3><p>改进指标与日志系统，让系统运行情况更容易被理解和定位。</p></div><div class="content-item"><h3>合作伙伴 Demo App</h3><p>编写技术需求文档，设计并开发后端，帮助合作伙伴测试广告行为。</p></div>${tech(['Golang','AWS','Kafka','MongoDB','Redis'])}`},
 didi:{label:'DiDi',index:'04 / 2020.11 — 2022.03',title:'让质量更早发生。',body:`<p class="lead">Developer Engineer · DiDi</p><p>开发自动化测试用例和 CI/CD 工具，在进入测试前拦截问题，减少重复劳动。</p><div class="content-item"><h3>自动化覆盖率统计服务</h3><p>自动计算测试覆盖率并收集结果。简历记录：为团队每周节省约 3 人天，多个服务的测试覆盖率提升 10%–30%。</p></div><div class="content-item"><h3>故障注入工具</h3><p>设计并开发问题注入与日志分析工具，用于发现关键问题。</p></div>${tech(['Golang','Shell','MySQL','Redis','CI/CD'])}`},
 skills:{label:'技术栈',index:'05 / 工具与系统',title:'把复杂留给系统。',body:`<p>从服务代码到运行环境，关注完整的软件交付过程。</p><div class="content-item"><h3>语言与基础</h3>${tech(['Golang','Python','Shell / Bash','算法与数据结构'])}</div><div class="content-item"><h3>云与架构</h3>${tech(['AWS','S3','Docker','Kubernetes','Kafka','微服务','Serverless'])}</div><div class="content-item"><h3>数据与缓存</h3>${tech(['MongoDB','MySQL','Redis'])}</div>`},
 education:{label:'Monash',index:'06 / 教育',title:'好奇心的起点。',body:`<p class="lead">Monash University</p><p>Information Technology · 信息技术本科</p><p>技术基础从网络、数据和软件开发展开，后来延伸到后端系统、云服务和自动化工具。</p>${tech(['Information Technology','Computer Networks','Software Development'])}`},
 projects:{label:'个人项目',index:'07 / 工作之外',title:'让代码真正有用。',body:`<div class="content-item"><h3>明日方舟自动化助手</h3><p>为游戏构建自动操作助手，通过接口采集数据并计算路径，将重复的操作交给程序。</p></div><div class="content-item"><h3>Python 数据采集</h3><p>围绕招聘、Steam 和电商网站开展个人数据采集项目，积累数据获取、处理和自动化经验。</p></div><div class="content-item"><h3>这个小小世界</h3><p>把个人经历变成可探索的海岛和星球，也提供一条随滚动展开的阅读路线。</p></div><a class="content-link" href="${profile.github}" target="_blank" rel="noopener noreferrer">GitHub / prefect12 <span>↗</span></a>`},
 contact:{label:'联系我',index:'08 / 下一次连接',title:'下一个想法，聊聊？',body:`<p>关于后端工程、自动化，或者一个值得做出来的新想法。</p><a class="content-link" href="${profile.github}" target="_blank" rel="noopener noreferrer">GitHub <span>↗</span></a><a class="content-link" href="${profile.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn <span>↗</span></a>`}
};
export const destinations=[
{id:'about',x:0,z:0,r:4.8,type:0},
{id:'ahalab',x:-22,z:-19,r:5.3,type:1},
{id:'liftoff',x:20,z:-25,r:5.2,type:2},
{id:'didi',x:31,z:4,r:4.8,type:4},
{id:'skills',x:17,z:28,r:4.9,type:5},
{id:'education',x:-11,z:33,r:4.7,type:6},
{id:'projects',x:-33,z:17,r:5.1,type:7},
{id:'contact',x:-37,z:-14,r:4.6,type:3}
];
export const worlds={
 ocean:{name:'Ocean',cn:'群岛漫游',title:'A little world,<br>a lot of curiosity.',description:'我是 Kade。一段经历，一座岛。',enter:'进入海岛',number:'01',hint:'驾驶小船，探索我的经历与作品。'},
 orbit:{name:'Orbit',cn:'星际航行',title:'Same curiosity.<br>A new universe.',description:'把探索半径，放得更远一点。',enter:'进入宇宙',number:'02',hint:'驾驶飞船，在星球之间寻找故事。'},
 journey:{name:'Journey',cn:'沿途的故事',title:'从好奇心，<br>到真正运行的系统。',description:'Kade Wu / Backend Engineer',enter:'开始阅读',number:'03',hint:'向下滚动，经历、技术与想法逐一展开。'}
};
