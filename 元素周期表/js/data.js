// 元素周期表数据 —— 118 个元素（人教版/中文教材惯例）
// z 原子序数 | symbol 符号 | zh 中文名 | en 英文名 | ipa 美式音标
// mass 相对原子质量（放射性元素用方括号质量数）
// block: s / d / ds / p / f（ds区=Cu Ag Au Zn Cd Hg Rg Cn；f区=57–71、89–103）
// group 1–18 | period 1–7 | ox 常用化合价 | compounds 常见化合物 | prop 元素性质
// altEn 可选：英文名的常见变体拼写（测试时同样判对）

const ELEMENTS = [
  // —— 第 1 周期 ——
  { z: 1,  symbol: "H",  zh: "氢", en: "Hydrogen",     ipa: "/ˈhaɪdrədʒən/",   mass: "1.008",  block: "s",  group: 1,  period: 1, ox: "+1, −1",
    compounds: "H₂O 水、HCl 盐酸、NH₃ 氨",
    prop: "宇宙中含量最多的元素，最轻、无色无味的气体，极易燃烧，是水和一切有机物的重要组成。" },

  { z: 2,  symbol: "He", zh: "氦", en: "Helium",       ipa: "/ˈhiːliəm/",      mass: "4.003",  block: "s",  group: 18, period: 1, ox: "0",
    compounds: "—",
    prop: "稀有气体，性质极不活泼，密度仅大于氢气，用于填充气球、飞艇和低温研究。" },

  // —— 第 2 周期 ——
  { z: 3,  symbol: "Li", zh: "锂", en: "Lithium",      ipa: "/ˈlɪθiəm/",       mass: "6.94",   block: "s",  group: 1,  period: 2, ox: "+1",
    compounds: "Li₂O 氧化锂、Li₂CO₃ 碳酸锂",
    prop: "最轻的金属，银白色质软，化学性质活泼，保存在石蜡中，广泛用于锂电池。" },

  { z: 4,  symbol: "Be", zh: "铍", en: "Beryllium",    ipa: "/bəˈrɪliəm/",     mass: "9.012",  block: "s",  group: 2,  period: 2, ox: "+2",
    compounds: "BeO 氧化铍、绿柱石 Be₃Al₂Si₆O₁₈",
    prop: "轻质坚硬的银白色金属，透X射线能力强，用于航空航天合金与核反应堆材料。" },

  { z: 5,  symbol: "B",  zh: "硼", en: "Boron",        ipa: "/ˈbɔːrɑːn/",      mass: "10.81",  block: "p",  group: 13, period: 2, ox: "+3",
    compounds: "H₃BO₃ 硼酸、硼砂 Na₂B₄O₇",
    prop: "黑色或棕色固体，硬度高、熔点高，用于耐热玻璃、半导体掺杂和洗涤剂。" },

  { z: 6,  symbol: "C",  zh: "碳", en: "Carbon",       ipa: "/ˈkɑːrbən/",      mass: "12.01",  block: "p",  group: 14, period: 2, ox: "+4, +2, −4",
    compounds: "CO₂ 二氧化碳、CH₄ 甲烷、CaCO₃ 碳酸钙",
    prop: "有机物的骨架元素，有金刚石、石墨、石墨烯等多种形态，是生命的基础。" },

  { z: 7,  symbol: "N",  zh: "氮", en: "Nitrogen",     ipa: "/ˈnaɪtrədʒən/",   mass: "14.01",  block: "p",  group: 15, period: 2, ox: "−3, +2, +4, +5",
    compounds: "NH₃ 氨、HNO₃ 硝酸、N₂O 一氧化二氮",
    prop: "空气的主要成分（约占78%），无色无味，化学性质稳定，是蛋白质和化肥的关键元素。" },

  { z: 8,  symbol: "O",  zh: "氧", en: "Oxygen",       ipa: "/ˈɑːksɪdʒən/",    mass: "16.00",  block: "p",  group: 16, period: 2, ox: "−2",
    compounds: "H₂O 水、CO₂ 二氧化碳、SiO₂ 石英",
    prop: "地壳中含量最多的元素，约占空气的21%，支持呼吸与燃烧，是绝大多数化合物的组成。" },

  { z: 9,  symbol: "F",  zh: "氟", en: "Fluorine",     ipa: "/ˈflʊəriːn/",     mass: "19.00",  block: "p",  group: 17, period: 2, ox: "−1",
    compounds: "HF 氢氟酸、CaF₂ 萤石",
    prop: "电负性最强、最活泼的非金属，浅黄绿色剧毒气体，用于制氟化物、牙膏防龋。" },

  { z: 10, symbol: "Ne", zh: "氖", en: "Neon",         ipa: "/ˈniːɑːn/",       mass: "20.18",  block: "p",  group: 18, period: 2, ox: "0",
    compounds: "—",
    prop: "稀有气体，通电发出红色光，用于霓虹灯招牌与高压指示灯。" },

  // —— 第 3 周期 ——
  { z: 11, symbol: "Na", zh: "钠", en: "Sodium",       ipa: "/ˈsoʊdiəm/",      mass: "22.99",  block: "s",  group: 1,  period: 3, ox: "+1",
    compounds: "NaCl 食盐、NaOH 烧碱、NaHCO₃ 小苏打",
    prop: "银白色软金属，化学性质非常活泼，与水剧烈反应，保存在煤油中。" },

  { z: 12, symbol: "Mg", zh: "镁", en: "Magnesium",    ipa: "/mæɡˈniːziəm/",   mass: "24.31",  block: "s",  group: 2,  period: 3, ox: "+2",
    compounds: "MgO 氧化镁、MgSO₄ 泻盐、叶绿素（含镁）",
    prop: "银白色轻金属，燃烧时发出耀眼白光，用于合金、烟花；叶绿素含镁。" },

  { z: 13, symbol: "Al", zh: "铝", en: "Aluminium",    ipa: "/ˌæljəˈmɪniəm/",  mass: "26.98",  block: "p",  group: 13, period: 3, ox: "+3",
    compounds: "Al₂O₃ 氧化铝、明矾 KAl(SO₄)₂·12H₂O",
    prop: "地壳中含量最多的金属，质轻、抗腐蚀（表面有致密氧化膜），广泛用于建筑、包装。",
    altEn: ["Aluminum"] },

  { z: 14, symbol: "Si", zh: "硅", en: "Silicon",      ipa: "/ˈsɪlɪkən/",      mass: "28.09",  block: "p",  group: 14, period: 3, ox: "+4, −4",
    compounds: "SiO₂ 石英、Na₂SiO₃ 硅酸钠",
    prop: "地壳中含量第二的元素，半导体工业的核心材料，用于芯片与太阳能电池。" },

  { z: 15, symbol: "P",  zh: "磷", en: "Phosphorus",   ipa: "/ˈfɑːsfərəs/",    mass: "30.97",  block: "p",  group: 15, period: 3, ox: "+5, +3, −3",
    compounds: "P₂O₅ 五氧化二磷、Ca₃(PO₄)₂ 磷酸钙",
    prop: "有白磷、红磷等形态，白磷剧毒且易自燃，是骨骼和DNA的重要成分。" },

  { z: 16, symbol: "S",  zh: "硫", en: "Sulfur",       ipa: "/ˈsʌlfər/",       mass: "32.06",  block: "p",  group: 16, period: 3, ox: "−2, +4, +6",
    compounds: "H₂SO₄ 硫酸、SO₂ 二氧化硫、FeS₂ 黄铁矿",
    prop: "黄色晶体，俗称硫磺，燃烧生成有刺激性气味的SO₂，用于制造硫酸、橡胶硫化。",
    altEn: ["Sulphur"] },

  { z: 17, symbol: "Cl", zh: "氯", en: "Chlorine",     ipa: "/ˈklɔːriːn/",     mass: "35.45",  block: "p",  group: 17, period: 3, ox: "−1, +1, +5, +7",
    compounds: "NaCl 食盐、HCl 盐酸、NaClO 漂白液",
    prop: "黄绿色有刺激性气味的气体，强氧化性，用于自来水消毒和制漂白剂。" },

  { z: 18, symbol: "Ar", zh: "氩", en: "Argon",        ipa: "/ˈɑːrɡɑːn/",      mass: "39.95",  block: "p",  group: 18, period: 3, ox: "0",
    compounds: "—",
    prop: "空气中含量最多的稀有气体，用作焊接保护气和灯泡的填充气。" },

  // —— 第 4 周期 ——
  { z: 19, symbol: "K",  zh: "钾", en: "Potassium",    ipa: "/pəˈtæsiəm/",     mass: "39.10",  block: "s",  group: 1,  period: 4, ox: "+1",
    compounds: "KCl 氯化钾、KNO₃ 硝酸钾、KOH 氢氧化钾",
    prop: "银白色软金属，极活泼，与水剧烈反应甚至燃烧，是植物必需的营养元素（钾肥）。" },

  { z: 20, symbol: "Ca", zh: "钙", en: "Calcium",      ipa: "/ˈkælsiəm/",      mass: "40.08",  block: "s",  group: 2,  period: 4, ox: "+2",
    compounds: "CaCO₃ 石灰石、CaO 生石灰、Ca(OH)₂ 熟石灰",
    prop: "银白色金属，是骨骼和牙齿的主要成分，石灰石、大理石的主要组成，建筑材料。" },

  { z: 21, symbol: "Sc", zh: "钪", en: "Scandium",     ipa: "/ˈskændiəm/",     mass: "44.96",  block: "d",  group: 3,  period: 4, ox: "+3",
    compounds: "Sc₂O₃ 氧化钪",
    prop: "轻质银白色金属，加入铝中可大幅提高强度，用于高强度铝合金。" },

  { z: 22, symbol: "Ti", zh: "钛", en: "Titanium",     ipa: "/taɪˈteɪniəm/",   mass: "47.87",  block: "d",  group: 4,  period: 4, ox: "+4, +3",
    compounds: "TiO₂ 钛白粉、TiCl₄ 四氯化钛",
    prop: "银白色金属，强度高、密度小、抗腐蚀，用于航空航天、人工关节和钛白颜料。" },

  { z: 23, symbol: "V",  zh: "钒", en: "Vanadium",     ipa: "/vəˈneɪdiəm/",    mass: "50.94",  block: "d",  group: 5,  period: 4, ox: "+5, +4, +3",
    compounds: "V₂O₅ 五氧化二钒",
    prop: "银白色金属，用于制造高强度合金钢，其氧化物是重要催化剂。" },

  { z: 24, symbol: "Cr", zh: "铬", en: "Chromium",     ipa: "/ˈkroʊmiəm/",     mass: "52.00",  block: "d",  group: 6,  period: 4, ox: "+3, +6",
    compounds: "K₂Cr₂O₇ 重铬酸钾、Cr₂O₃ 氧化铬",
    prop: "银白色硬金属，抗腐蚀，是不锈钢的重要成分，也用于电镀和颜料。" },

  { z: 25, symbol: "Mn", zh: "锰", en: "Manganese",    ipa: "/ˈmæŋɡəniːz/",    mass: "54.94",  block: "d",  group: 7,  period: 4, ox: "+2, +4, +7",
    compounds: "KMnO₄ 高锰酸钾、MnO₂ 二氧化锰",
    prop: "灰白色金属，用于炼钢脱氧和制造锰钢，高锰酸钾是常用消毒剂。" },

  { z: 26, symbol: "Fe", zh: "铁", en: "Iron",         ipa: "/ˈaɪərn/",        mass: "55.85",  block: "d",  group: 8,  period: 4, ox: "+2, +3",
    compounds: "Fe₂O₃ 赤铁矿、Fe₃O₄ 磁铁矿、FeSO₄ 绿矾",
    prop: "应用最广的金属，有磁性，地壳中金属含量居第二，是炼钢的主要原料。" },

  { z: 27, symbol: "Co", zh: "钴", en: "Cobalt",       ipa: "/ˈkoʊbɔːlt/",     mass: "58.93",  block: "d",  group: 9,  period: 4, ox: "+2, +3",
    compounds: "CoCl₂ 氯化钴、维生素B₁₂（含钴）",
    prop: "银白色铁磁性金属，用于合金、钴蓝颜料和锂电池正极材料。" },

  { z: 28, symbol: "Ni", zh: "镍", en: "Nickel",       ipa: "/ˈnɪkəl/",        mass: "58.69",  block: "d",  group: 10, period: 4, ox: "+2",
    compounds: "NiSO₄ 硫酸镍、Ni(CO)₄ 羰基镍",
    prop: "银白色抗腐蚀金属，用于不锈钢、镀镍和镍氢电池。" },

  { z: 29, symbol: "Cu", zh: "铜", en: "Copper",       ipa: "/ˈkɑːpər/",       mass: "63.55",  block: "ds", group: 11, period: 4, ox: "+1, +2",
    compounds: "CuSO₄·5H₂O 胆矾、Cu₂O 氧化亚铜",
    prop: "紫红色金属，导电导热性好，是人类最早使用的金属之一，用于电线电缆。" },

  { z: 30, symbol: "Zn", zh: "锌", en: "Zinc",         ipa: "/zɪŋk/",          mass: "65.38",  block: "ds", group: 12, period: 4, ox: "+2",
    compounds: "ZnO 氧化锌、ZnSO₄ 皓矾",
    prop: "青白色金属，用于镀锌防锈、干电池和黄铜合金。" },

  { z: 31, symbol: "Ga", zh: "镓", en: "Gallium",      ipa: "/ˈɡæliəm/",       mass: "69.72",  block: "p",  group: 13, period: 4, ox: "+3",
    compounds: "GaAs 砷化镓",
    prop: "低熔点银白色金属（体温即可熔化），用于半导体和LED材料。" },

  { z: 32, symbol: "Ge", zh: "锗", en: "Germanium",    ipa: "/dʒərˈmeɪniəm/",  mass: "72.63",  block: "p",  group: 14, period: 4, ox: "+4, +2",
    compounds: "GeO₂ 二氧化锗",
    prop: "灰白色类金属，早期半导体材料，用于光纤与红外光学仪器。" },

  { z: 33, symbol: "As", zh: "砷", en: "Arsenic",      ipa: "/ˈɑːrsnɪk/",      mass: "74.92",  block: "p",  group: 15, period: 4, ox: "+3, +5",
    compounds: "As₂O₃ 砒霜、As₂S₃ 雄黄",
    prop: "灰色类金属，有剧毒（砒霜即三氧化二砷），化合物曾用作农药。" },

  { z: 34, symbol: "Se", zh: "硒", en: "Selenium",     ipa: "/səˈliːniəm/",    mass: "78.97",  block: "p",  group: 16, period: 4, ox: "−2, +4, +6",
    compounds: "Na₂SeO₃ 亚硒酸钠",
    prop: "灰色或红色非金属，人体必需的微量元素，具有抗氧化作用，用于光敏材料。" },

  { z: 35, symbol: "Br", zh: "溴", en: "Bromine",      ipa: "/ˈbroʊmiːn/",     mass: "79.90",  block: "p",  group: 17, period: 4, ox: "−1, +1, +5",
    compounds: "NaBr 溴化钠、AgBr 溴化银",
    prop: "常温下唯一呈液态的非金属，深红棕色、有刺激性气味，用于阻燃剂和感光材料。" },

  { z: 36, symbol: "Kr", zh: "氪", en: "Krypton",      ipa: "/ˈkrɪptɑːn/",     mass: "83.80",  block: "p",  group: 18, period: 4, ox: "0",
    compounds: "—",
    prop: "稀有气体，通电发出白光，用于高性能照明和激光。" },

  // —— 第 5 周期 ——
  { z: 37, symbol: "Rb", zh: "铷", en: "Rubidium",     ipa: "/ruːˈbɪdiəm/",    mass: "85.47",  block: "s",  group: 1,  period: 5, ox: "+1",
    compounds: "RbCl 氯化铷",
    prop: "银白色软金属，极活泼，遇水爆炸，用于原子钟和光电管。" },

  { z: 38, symbol: "Sr", zh: "锶", en: "Strontium",    ipa: "/ˈstrɑːnʃiəm/",   mass: "87.62",  block: "s",  group: 2,  period: 5, ox: "+2",
    compounds: "SrCO₃ 碳酸锶、Sr(NO₃)₂ 硝酸锶",
    prop: "银白色金属，焰色反应呈红色，用于烟花和磁性材料。" },

  { z: 39, symbol: "Y",  zh: "钇", en: "Yttrium",      ipa: "/ˈɪtriəm/",       mass: "88.91",  block: "d",  group: 3,  period: 5, ox: "+3",
    compounds: "Y₂O₃ 氧化钇",
    prop: "银白色金属，用于超导材料、荧光粉和特种合金。" },

  { z: 40, symbol: "Zr", zh: "锆", en: "Zirconium",    ipa: "/zɜːrˈkoʊniəm/",  mass: "91.22",  block: "d",  group: 4,  period: 5, ox: "+4",
    compounds: "ZrO₂ 氧化锆、锆石 ZrSiO₄",
    prop: "银灰色金属，抗腐蚀，用于核反应堆包壳和人造宝石（立方氧化锆）。" },

  { z: 41, symbol: "Nb", zh: "铌", en: "Niobium",      ipa: "/naɪˈoʊbiəm/",    mass: "92.91",  block: "d",  group: 5,  period: 5, ox: "+5",
    compounds: "Nb₂O₅ 五氧化二铌",
    prop: "灰白色金属，用于超导材料和特种合金。" },

  { z: 42, symbol: "Mo", zh: "钼", en: "Molybdenum",   ipa: "/məˈlɪbdənəm/",   mass: "95.95",  block: "d",  group: 6,  period: 5, ox: "+6, +4",
    compounds: "MoS₂ 辉钼矿、(NH₄)₂MoO₄ 钼酸铵",
    prop: "银白色高熔点金属，用于合金钢，也是植物固氮所需微量元素的组成。" },

  { z: 43, symbol: "Tc", zh: "锝", en: "Technetium",   ipa: "/tekˈniːʃiəm/",   mass: "[98]",   block: "d",  group: 7,  period: 5, ox: "+7",
    compounds: "TcO₄⁻ 高锝酸根",
    prop: "第一个人工合成的元素，具有放射性，用于医学显像诊断。" },

  { z: 44, symbol: "Ru", zh: "钌", en: "Ruthenium",    ipa: "/ruːˈθiːniəm/",   mass: "101.1",  block: "d",  group: 8,  period: 5, ox: "+3, +4",
    compounds: "RuO₂ 二氧化钌",
    prop: "银白色硬金属，用于耐磨电触点和催化剂。" },

  { z: 45, symbol: "Rh", zh: "铑", en: "Rhodium",      ipa: "/ˈroʊdiəm/",      mass: "102.9",  block: "d",  group: 9,  period: 5, ox: "+3",
    compounds: "RhCl₃ 三氯化铑",
    prop: "银白色贵金属，抗腐蚀，用于汽车催化转换器和首饰镀层。" },

  { z: 46, symbol: "Pd", zh: "钯", en: "Palladium",    ipa: "/pəˈleɪdiəm/",    mass: "106.4",  block: "d",  group: 10, period: 5, ox: "+2, +4",
    compounds: "PdCl₂ 氯化钯",
    prop: "银白色贵金属，能大量吸收氢气，用于催化剂和首饰。" },

  { z: 47, symbol: "Ag", zh: "银", en: "Silver",       ipa: "/ˈsɪlvər/",       mass: "107.9",  block: "ds", group: 11, period: 5, ox: "+1",
    compounds: "AgNO₃ 硝酸银、AgCl 氯化银、AgBr 溴化银",
    prop: "导电性最好的金属，白色光泽，用于首饰、银器和感光材料。" },

  { z: 48, symbol: "Cd", zh: "镉", en: "Cadmium",      ipa: "/ˈkædmiəm/",      mass: "112.4",  block: "ds", group: 12, period: 5, ox: "+2",
    compounds: "CdS 硫化镉",
    prop: "银白色软金属，有毒，曾用于镍镉电池，现多用于颜料。" },

  { z: 49, symbol: "In", zh: "铟", en: "Indium",       ipa: "/ˈɪndiəm/",       mass: "114.8",  block: "p",  group: 13, period: 5, ox: "+3",
    compounds: "In₂O₃ 氧化铟",
    prop: "银白色软金属，用于ITO透明导电膜（触摸屏）和低熔点合金。" },

  { z: 50, symbol: "Sn", zh: "锡", en: "Tin",          ipa: "/tɪn/",           mass: "118.7",  block: "p",  group: 14, period: 5, ox: "+2, +4",
    compounds: "SnO₂ 二氧化锡、SnCl₂ 氯化亚锡",
    prop: "银白色低熔点金属，用于马口铁（镀锡铁皮）、焊锡和青铜。" },

  { z: 51, symbol: "Sb", zh: "锑", en: "Antimony",     ipa: "/ˈæntɪmoʊni/",    mass: "121.8",  block: "p",  group: 15, period: 5, ox: "+3, +5",
    compounds: "Sb₂O₃ 三氧化二锑",
    prop: "银灰色脆性类金属，用于阻燃剂和合金。" },

  { z: 52, symbol: "Te", zh: "碲", en: "Tellurium",    ipa: "/teˈlʊriəm/",     mass: "127.6",  block: "p",  group: 16, period: 5, ox: "−2, +4, +6",
    compounds: "TeO₂ 二氧化碲",
    prop: "银白色脆性类金属，用于半导体和合金。" },

  { z: 53, symbol: "I",  zh: "碘", en: "Iodine",       ipa: "/ˈaɪədaɪn/",      mass: "126.9",  block: "p",  group: 17, period: 5, ox: "−1, +5, +7",
    compounds: "KI 碘化钾、NaIO₃ 碘酸钠",
    prop: "紫黑色晶体，易升华，人体必需的微量元素，用于消毒和甲状腺激素的合成。" },

  { z: 54, symbol: "Xe", zh: "氙", en: "Xenon",        ipa: "/ˈziːnɑːn/",      mass: "131.3",  block: "p",  group: 18, period: 5, ox: "0, +2",
    compounds: "XeF₂ 二氟化氙",
    prop: "稀有气体，通电发出蓝光，用于车灯和闪光灯；也能与氟形成化合物。" },

  // —— 第 6 周期 ——
  { z: 55, symbol: "Cs", zh: "铯", en: "Caesium",      ipa: "/ˈsiːziəm/",      mass: "132.9",  block: "s",  group: 1,  period: 6, ox: "+1",
    compounds: "CsCl 氯化铯",
    prop: "银白色极软金属，最活泼的金属之一，遇水爆炸，用于原子钟。",
    altEn: ["Cesium"] },

  { z: 56, symbol: "Ba", zh: "钡", en: "Barium",       ipa: "/ˈberiəm/",       mass: "137.3",  block: "s",  group: 2,  period: 6, ox: "+2",
    compounds: "BaSO₄ 重晶石、BaCO₃ 碳酸钡",
    prop: "银白色金属，焰色反应呈黄绿色，硫酸钡用于医学钡餐造影。" },

  { z: 57, symbol: "La", zh: "镧", en: "Lanthanum",    ipa: "/ˈlænθənəm/",     mass: "138.9",  block: "f",  group: 3,  period: 6, ox: "+3",
    compounds: "La₂O₃ 氧化镧",
    prop: "银白色稀土金属，镧系元素之首，用于镍氢电池和光学玻璃。" },

  { z: 58, symbol: "Ce", zh: "铈", en: "Cerium",       ipa: "/ˈsɪriəm/",       mass: "140.1",  block: "f",  group: 3,  period: 6, ox: "+3, +4",
    compounds: "CeO₂ 二氧化铈",
    prop: "含量最多的稀土元素，用于打火石和玻璃抛光粉。" },

  { z: 59, symbol: "Pr", zh: "镨", en: "Praseodymium", ipa: "/ˌpreɪziəˈdɪmiəm/", mass: "140.9", block: "f",  group: 3,  period: 6, ox: "+3",
    compounds: "Pr₆O₁₁ 氧化镨",
    prop: "银白色稀土金属，用于永磁材料和着色玻璃。" },

  { z: 60, symbol: "Nd", zh: "钕", en: "Neodymium",    ipa: "/ˌniːəˈdɪmiəm/",  mass: "144.2",  block: "f",  group: 3,  period: 6, ox: "+3",
    compounds: "Nd₂Fe₁₄B 钕铁硼磁体",
    prop: "银白色稀土金属，用于钕铁硼强磁体和激光器。" },

  { z: 61, symbol: "Pm", zh: "钷", en: "Promethium",   ipa: "/prəˈmiːθiəm/",   mass: "[145]",  block: "f",  group: 3,  period: 6, ox: "+3",
    compounds: "—",
    prop: "放射性稀土元素，用于夜光涂料和核电池。" },

  { z: 62, symbol: "Sm", zh: "钐", en: "Samarium",     ipa: "/səˈmeriəm/",     mass: "150.4",  block: "f",  group: 3,  period: 6, ox: "+3",
    compounds: "SmCo₅ 钐钴磁体",
    prop: "银白色稀土金属，用于耐高温的钐钴磁体。" },

  { z: 63, symbol: "Eu", zh: "铕", en: "Europium",     ipa: "/jʊˈroʊpiəm/",    mass: "152.0",  block: "f",  group: 3,  period: 6, ox: "+2, +3",
    compounds: "—",
    prop: "银白色稀土金属，用于荧光粉（发出红光，用于显示屏）。" },

  { z: 64, symbol: "Gd", zh: "钆", en: "Gadolinium",   ipa: "/ˌɡædəˈlɪniəm/",  mass: "157.3",  block: "f",  group: 3,  period: 6, ox: "+3",
    compounds: "—",
    prop: "银白色稀土金属，用于MRI造影剂和核反应堆控制棒。" },

  { z: 65, symbol: "Tb", zh: "铽", en: "Terbium",      ipa: "/ˈtɜːrbiəm/",     mass: "158.9",  block: "f",  group: 3,  period: 6, ox: "+3, +4",
    compounds: "—",
    prop: "银白色稀土金属，用于绿色荧光粉和磁光材料。" },

  { z: 66, symbol: "Dy", zh: "镝", en: "Dysprosium",   ipa: "/dɪsˈproʊziəm/",  mass: "162.5",  block: "f",  group: 3,  period: 6, ox: "+3",
    compounds: "—",
    prop: "银白色稀土金属，加入磁体中可提高耐热性，用于高性能电机。" },

  { z: 67, symbol: "Ho", zh: "钬", en: "Holmium",      ipa: "/ˈhoʊlmiəm/",     mass: "164.9",  block: "f",  group: 3,  period: 6, ox: "+3",
    compounds: "—",
    prop: "银白色稀土金属，用于激光器和核反应堆控制棒。" },

  { z: 68, symbol: "Er", zh: "铒", en: "Erbium",       ipa: "/ˈɜːrbiəm/",      mass: "167.3",  block: "f",  group: 3,  period: 6, ox: "+3",
    compounds: "—",
    prop: "银白色稀土金属，用于光纤放大和玻璃着色。" },

  { z: 69, symbol: "Tm", zh: "铥", en: "Thulium",      ipa: "/ˈθuːliəm/",      mass: "168.9",  block: "f",  group: 3,  period: 6, ox: "+3",
    compounds: "—",
    prop: "银白色稀土金属，最稀有的稀土之一，用于便携式X射线源。" },

  { z: 70, symbol: "Yb", zh: "镱", en: "Ytterbium",    ipa: "/ɪˈtɜːrbiəm/",    mass: "173.0",  block: "f",  group: 3,  period: 6, ox: "+2, +3",
    compounds: "—",
    prop: "银白色稀土金属，用于原子钟和不锈钢掺杂。" },

  { z: 71, symbol: "Lu", zh: "镥", en: "Lutetium",     ipa: "/luːˈtiːʃiəm/",   mass: "175.0",  block: "f",  group: 3,  period: 6, ox: "+3",
    compounds: "—",
    prop: "银白色稀土金属，密度最大的稀土元素，用于PET扫描晶体。" },

  { z: 72, symbol: "Hf", zh: "铪", en: "Hafnium",      ipa: "/ˈhæfniəm/",      mass: "178.5",  block: "d",  group: 4,  period: 6, ox: "+4",
    compounds: "HfO₂ 氧化铪",
    prop: "银灰色金属，吸收中子能力强，用于核反应堆控制棒。" },

  { z: 73, symbol: "Ta", zh: "钽", en: "Tantalum",     ipa: "/ˈtæntələm/",     mass: "180.9",  block: "d",  group: 5,  period: 6, ox: "+5",
    compounds: "Ta₂O₅ 五氧化二钽",
    prop: "灰蓝色金属，极抗腐蚀，用于电容器和人造骨。" },

  { z: 74, symbol: "W",  zh: "钨", en: "Tungsten",     ipa: "/ˈtʌŋstən/",      mass: "183.8",  block: "d",  group: 6,  period: 6, ox: "+6, +4",
    compounds: "WO₃ 三氧化钨、CaWO₄ 白钨矿",
    prop: "熔点最高的金属（3410℃），用于灯丝和硬质合金。" },

  { z: 75, symbol: "Re", zh: "铼", en: "Rhenium",      ipa: "/ˈriːniəm/",      mass: "186.2",  block: "d",  group: 7,  period: 6, ox: "+7, +4",
    compounds: "KReO₄ 高铼酸钾",
    prop: "稀有的高熔点金属，用于航空发动机高温合金。" },

  { z: 76, symbol: "Os", zh: "锇", en: "Osmium",       ipa: "/ˈɑːzmiəm/",      mass: "190.2",  block: "d",  group: 8,  period: 6, ox: "+8, +4",
    compounds: "OsO₄ 四氧化锇",
    prop: "密度最大的金属，极硬，用于笔尖和耐磨合金。" },

  { z: 77, symbol: "Ir", zh: "铱", en: "Iridium",      ipa: "/ɪˈrɪdiəm/",      mass: "192.2",  block: "d",  group: 9,  period: 6, ox: "+3, +4",
    compounds: "IrO₂ 二氧化铱",
    prop: "极抗腐蚀的贵金属，用于火花塞；曾用于国际千克原器。" },

  { z: 78, symbol: "Pt", zh: "铂", en: "Platinum",     ipa: "/ˈplætənəm/",     mass: "195.1",  block: "d",  group: 10, period: 6, ox: "+2, +4",
    compounds: "H₂PtCl₆ 氯铂酸",
    prop: "银白色贵金属，抗腐蚀，用于首饰和催化剂。" },

  { z: 79, symbol: "Au", zh: "金", en: "Gold",         ipa: "/ɡoʊld/",         mass: "197.0",  block: "ds", group: 11, period: 6, ox: "+1, +3",
    compounds: "AuCl₃ 三氯化金",
    prop: "黄色贵金属，延展性极好，化学性质稳定，用于首饰和电子触点。" },

  { z: 80, symbol: "Hg", zh: "汞", en: "Mercury",      ipa: "/ˈmɜːrkjəri/",    mass: "200.6",  block: "ds", group: 12, period: 6, ox: "+1, +2",
    compounds: "HgS 朱砂、HgCl₂ 升汞",
    prop: "常温下唯一呈液态的金属，俗称水银，有毒，用于荧光灯；温度计中已逐步淘汰。" },

  { z: 81, symbol: "Tl", zh: "铊", en: "Thallium",     ipa: "/ˈθæliəm/",       mass: "204.4",  block: "p",  group: 13, period: 6, ox: "+1, +3",
    compounds: "Tl₂SO₄ 硫酸亚铊",
    prop: "银白色软金属，铊盐剧毒，用于特种玻璃和光电管。" },

  { z: 82, symbol: "Pb", zh: "铅", en: "Lead",         ipa: "/led/",           mass: "207.2",  block: "p",  group: 14, period: 6, ox: "+2, +4",
    compounds: "PbO 氧化铅、PbSO₄ 硫酸铅、Pb₃O₄ 铅丹",
    prop: "蓝灰色软金属，密度大、有毒，用于蓄电池和防辐射屏蔽。" },

  { z: 83, symbol: "Bi", zh: "铋", en: "Bismuth",      ipa: "/ˈbɪzməθ/",       mass: "209.0",  block: "p",  group: 15, period: 6, ox: "+3, +5",
    compounds: "Bi₂O₃ 氧化铋",
    prop: "银白色带粉红光泽的脆性金属，用于医药和低熔点合金。" },

  { z: 84, symbol: "Po", zh: "钋", en: "Polonium",     ipa: "/pəˈloʊniəm/",    mass: "[209]",  block: "p",  group: 16, period: 6, ox: "+2, +4",
    compounds: "—",
    prop: "居里夫人发现的强放射性元素，用于航天器热电源。" },

  { z: 85, symbol: "At", zh: "砹", en: "Astatine",     ipa: "/ˈæstətiːn/",     mass: "[210]",  block: "p",  group: 17, period: 6, ox: "−1, +1",
    compounds: "—",
    prop: "最稀有的天然元素之一，强放射性，性质介于碘与金属之间。" },

  { z: 86, symbol: "Rn", zh: "氡", en: "Radon",        ipa: "/ˈreɪdɑːn/",      mass: "[222]",  block: "p",  group: 18, period: 6, ox: "0",
    compounds: "—",
    prop: "放射性稀有气体，由地下岩石释放，是室内空气污染物，注意通风。" },

  // —— 第 7 周期 ——
  { z: 87, symbol: "Fr", zh: "钫", en: "Francium",     ipa: "/ˈfrænsiəm/",     mass: "[223]",  block: "s",  group: 1,  period: 7, ox: "+1",
    compounds: "—",
    prop: "最活泼的碱金属，极不稳定，天然存在量极微。" },

  { z: 88, symbol: "Ra", zh: "镭", en: "Radium",       ipa: "/ˈreɪdiəm/",      mass: "[226]",  block: "s",  group: 2,  period: 7, ox: "+2",
    compounds: "RaCl₂ 氯化镭",
    prop: "居里夫妇发现的放射性元素，曾用于夜光涂料与早期放射治疗。" },

  { z: 89, symbol: "Ac", zh: "锕", en: "Actinium",     ipa: "/ækˈtɪniəm/",     mass: "[227]",  block: "f",  group: 3,  period: 7, ox: "+3",
    compounds: "—",
    prop: "银白色放射性元素，黑暗中发蓝光，是锕系元素之首。" },

  { z: 90, symbol: "Th", zh: "钍", en: "Thorium",      ipa: "/ˈθɔːriəm/",      mass: "232.0",  block: "f",  group: 3,  period: 7, ox: "+4",
    compounds: "ThO₂ 二氧化钍",
    prop: "放射性金属，储量丰富，钍基核能前景广阔。" },

  { z: 91, symbol: "Pa", zh: "镤", en: "Protactinium", ipa: "/ˌproʊtækˈtɪniəm/", mass: "231.0", block: "f",  group: 3,  period: 7, ox: "+5",
    compounds: "—",
    prop: "稀有放射性元素，自然界含量极少。" },

  { z: 92, symbol: "U",  zh: "铀", en: "Uranium",      ipa: "/jʊˈreɪniəm/",    mass: "238.0",  block: "f",  group: 3,  period: 7, ox: "+6, +4",
    compounds: "UO₂ 二氧化铀、U₃O₈ 八氧化三铀",
    prop: "核能的主要燃料，天然铀以U-238为主，用于核电站与核武器。" },

  { z: 93, symbol: "Np", zh: "镎", en: "Neptunium",    ipa: "/nepˈtuːniəm/",   mass: "[237]",  block: "f",  group: 3,  period: 7, ox: "+5, +4",
    compounds: "—",
    prop: "第一个超铀元素，人工合成，银白色放射性金属。" },

  { z: 94, symbol: "Pu", zh: "钚", en: "Plutonium",    ipa: "/pluːˈtoʊniəm/",  mass: "[244]",  block: "f",  group: 3,  period: 7, ox: "+4, +6",
    compounds: "—",
    prop: "人工放射性元素，用作核燃料与核武器材料。" },

  { z: 95, symbol: "Am", zh: "镅", en: "Americium",    ipa: "/ˌæməˈrɪsiəm/",   mass: "[243]",  block: "f",  group: 3,  period: 7, ox: "+3",
    compounds: "—",
    prop: "人工放射性元素，用于烟雾探测器。" },

  { z: 96, symbol: "Cm", zh: "锔", en: "Curium",       ipa: "/ˈkjʊriəm/",      mass: "[247]",  block: "f",  group: 3,  period: 7, ox: "+3",
    compounds: "—",
    prop: "人工放射性元素，为纪念居里夫妇而命名，用于航天电源。" },

  { z: 97, symbol: "Bk", zh: "锫", en: "Berkelium",    ipa: "/bɜːrˈkiːliəm/",  mass: "[247]",  block: "f",  group: 3,  period: 7, ox: "+3",
    compounds: "—",
    prop: "人工放射性元素，以伯克利市命名。" },

  { z: 98, symbol: "Cf", zh: "锎", en: "Californium",  ipa: "/ˌkæləˈfɔːrniəm/", mass: "[251]", block: "f",  group: 3,  period: 7, ox: "+3",
    compounds: "—",
    prop: "人工放射性元素，可作强中子源，价格昂贵。" },

  { z: 99, symbol: "Es", zh: "锿", en: "Einsteinium",  ipa: "/aɪnˈstaɪniəm/",  mass: "[252]",  block: "f",  group: 3,  period: 7, ox: "+3",
    compounds: "—",
    prop: "人工放射性元素，纪念爱因斯坦，首次在氢弹爆炸产物中发现。" },

  { z: 100, symbol: "Fm", zh: "镄", en: "Fermium",     ipa: "/ˈfɜːrmiəm/",     mass: "[257]",  block: "f",  group: 3,  period: 7, ox: "+3",
    compounds: "—",
    prop: "人工放射性元素，纪念费米，只能微量合成。" },

  { z: 101, symbol: "Md", zh: "钔", en: "Mendelevium", ipa: "/ˌmendəˈliːviəm/", mass: "[258]", block: "f",  group: 3,  period: 7, ox: "+3",
    compounds: "—",
    prop: "人工放射性元素，纪念门捷列夫。" },

  { z: 102, symbol: "No", zh: "锘", en: "Nobelium",    ipa: "/noʊˈbeliəm/",    mass: "[259]",  block: "f",  group: 3,  period: 7, ox: "+2",
    compounds: "—",
    prop: "人工放射性元素，纪念诺贝尔。" },

  { z: 103, symbol: "Lr", zh: "铹", en: "Lawrencium",  ipa: "/lɔːˈrensiəm/",   mass: "[266]",  block: "f",  group: 3,  period: 7, ox: "+3",
    compounds: "—",
    prop: "人工放射性元素，纪念劳伦斯，最后一个锕系元素。" },

  { z: 104, symbol: "Rf", zh: "𬬻", en: "Rutherfordium", ipa: "/ˌrʌðərˈfɔːrdiəm/", mass: "[267]", block: "d",  group: 4,  period: 7, ox: "+4",
    compounds: "—",
    prop: "人工放射性元素，纪念卢瑟福，属超重元素。" },

  { z: 105, symbol: "Db", zh: "𬭊", en: "Dubnium",     ipa: "/ˈduːbniəm/",     mass: "[268]",  block: "d",  group: 5,  period: 7, ox: "+5",
    compounds: "—",
    prop: "人工放射性元素，以杜布纳研究所命名。" },

  { z: 106, symbol: "Sg", zh: "𬭳", en: "Seaborgium",  ipa: "/siːˈbɔːrɡiəm/",  mass: "[269]",  block: "d",  group: 6,  period: 7, ox: "+6",
    compounds: "—",
    prop: "人工放射性元素，纪念西博格。" },

  { z: 107, symbol: "Bh", zh: "𬭛", en: "Bohrium",     ipa: "/ˈbɔːriəm/",      mass: "[270]",  block: "d",  group: 7,  period: 7, ox: "+7",
    compounds: "—",
    prop: "人工放射性元素，纪念玻尔。" },

  { z: 108, symbol: "Hs", zh: "𬭶", en: "Hassium",     ipa: "/ˈhæsiəm/",       mass: "[269]",  block: "d",  group: 8,  period: 7, ox: "+8",
    compounds: "—",
    prop: "人工放射性元素，以德国黑森州命名。" },

  { z: 109, symbol: "Mt", zh: "鿏", en: "Meitnerium",  ipa: "/maɪtˈnɜːriəm/",  mass: "[278]",  block: "d",  group: 9,  period: 7, ox: "—",
    compounds: "—",
    prop: "人工放射性元素，纪念女科学家迈特纳。" },

  { z: 110, symbol: "Ds", zh: "𫟼", en: "Darmstadtium", ipa: "/dɑːrmˈʃtætiəm/", mass: "[281]", block: "d",  group: 10, period: 7, ox: "—",
    compounds: "—",
    prop: "人工放射性元素，以达姆施塔特市命名。" },

  { z: 111, symbol: "Rg", zh: "𬬭", en: "Roentgenium", ipa: "/rʌntˈɡeniəm/",   mass: "[282]",  block: "ds", group: 11, period: 7, ox: "—",
    compounds: "—",
    prop: "人工放射性元素，纪念发现X射线的伦琴。" },

  { z: 112, symbol: "Cn", zh: "鿔", en: "Copernicium", ipa: "/ˌkoʊpərˈnɪsiəm/", mass: "[285]",  block: "ds", group: 12, period: 7, ox: "—",
    compounds: "—",
    prop: "人工放射性元素，纪念哥白尼。" },

  { z: 113, symbol: "Nh", zh: "鉨", en: "Nihonium",    ipa: "/nɪˈhoʊniəm/",    mass: "[286]",  block: "p",  group: 13, period: 7, ox: "—",
    compounds: "—",
    prop: "人工放射性元素，以日本（Nihon）命名。" },

  { z: 114, symbol: "Fl", zh: "𫓧", en: "Flerovium",   ipa: "/fləˈroʊviəm/",   mass: "[289]",  block: "p",  group: 14, period: 7, ox: "—",
    compounds: "—",
    prop: "人工放射性元素，纪念弗廖罗夫。" },

  { z: 115, symbol: "Mc", zh: "镆", en: "Moscovium",   ipa: "/mɒsˈkoʊviəm/",   mass: "[290]",  block: "p",  group: 15, period: 7, ox: "—",
    compounds: "—",
    prop: "人工放射性元素，以莫斯科命名。" },

  { z: 116, symbol: "Lv", zh: "𫟷", en: "Livermorium", ipa: "/ˌlɪvərˈmɔːriəm/", mass: "[293]", block: "p",  group: 16, period: 7, ox: "—",
    compounds: "—",
    prop: "人工放射性元素，以利弗莫尔实验室命名。" },

  { z: 117, symbol: "Ts", zh: "鿬", en: "Tennessine",  ipa: "/ˈtenəsiːn/",     mass: "[294]",  block: "p",  group: 17, period: 7, ox: "—",
    compounds: "—",
    prop: "人工放射性卤素，以美国田纳西州命名。" },

  { z: 118, symbol: "Og", zh: "鿫", en: "Oganesson",   ipa: "/ˌoʊɡəˈnesən/",   mass: "[294]",  block: "p",  group: 18, period: 7, ox: "—",
    compounds: "—",
    prop: "人工放射性稀有气体，纪念奥加涅相，目前最重的元素。" },
];

// ============ 基态电子排布式（按电子层顺序书写；判分时与书写顺序无关） ============
// 上标用 Unicode 上标字符：⁰¹²³⁴⁵⁶⁷⁸⁹

const CFG = {
  1:  "1s¹",
  2:  "1s²",
  3:  "1s²2s¹",
  4:  "1s²2s²",
  5:  "1s²2s²2p¹",
  6:  "1s²2s²2p²",
  7:  "1s²2s²2p³",
  8:  "1s²2s²2p⁴",
  9:  "1s²2s²2p⁵",
  10: "1s²2s²2p⁶",
  11: "1s²2s²2p⁶3s¹",
  12: "1s²2s²2p⁶3s²",
  13: "1s²2s²2p⁶3s²3p¹",
  14: "1s²2s²2p⁶3s²3p²",
  15: "1s²2s²2p⁶3s²3p³",
  16: "1s²2s²2p⁶3s²3p⁴",
  17: "1s²2s²2p⁶3s²3p⁵",
  18: "1s²2s²2p⁶3s²3p⁶",
  19: "1s²2s²2p⁶3s²3p⁶4s¹",
  20: "1s²2s²2p⁶3s²3p⁶4s²",
  21: "1s²2s²2p⁶3s²3p⁶3d¹4s²",
  22: "1s²2s²2p⁶3s²3p⁶3d²4s²",
  23: "1s²2s²2p⁶3s²3p⁶3d³4s²",
  24: "1s²2s²2p⁶3s²3p⁶3d⁵4s¹",
  25: "1s²2s²2p⁶3s²3p⁶3d⁵4s²",
  26: "1s²2s²2p⁶3s²3p⁶3d⁶4s²",
  27: "1s²2s²2p⁶3s²3p⁶3d⁷4s²",
  28: "1s²2s²2p⁶3s²3p⁶3d⁸4s²",
  29: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s¹",
  30: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²",
  31: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p¹",
  32: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p²",
  33: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p³",
  34: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁴",
  35: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁵",
  36: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶",
  37: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶5s¹",
  38: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶5s²",
  39: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹5s²",
  40: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d²5s²",
  41: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d⁴5s¹",
  42: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d⁵5s¹",
  43: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d⁵5s²",
  44: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d⁷5s¹",
  45: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d⁸5s¹",
  46: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰",
  47: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰5s¹",
  48: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰5s²",
  49: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰5s²5p¹",
  50: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰5s²5p²",
  51: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰5s²5p³",
  52: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰5s²5p⁴",
  53: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰5s²5p⁵",
  54: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰5s²5p⁶",
  55: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰5s²5p⁶6s¹",
  56: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰5s²5p⁶6s²",
  57: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰5s²5p⁶5d¹6s²",
  58: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹5s²5p⁶5d¹6s²",
  59: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f³5s²5p⁶6s²",
  60: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f⁴5s²5p⁶6s²",
  61: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f⁵5s²5p⁶6s²",
  62: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f⁶5s²5p⁶6s²",
  63: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f⁷5s²5p⁶6s²",
  64: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f⁷5s²5p⁶5d¹6s²",
  65: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f⁹5s²5p⁶6s²",
  66: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁰5s²5p⁶6s²",
  67: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹¹5s²5p⁶6s²",
  68: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹²5s²5p⁶6s²",
  69: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹³5s²5p⁶6s²",
  70: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶6s²",
  71: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹6s²",
  72: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d²6s²",
  73: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d³6s²",
  74: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d⁴6s²",
  75: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d⁵6s²",
  76: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d⁶6s²",
  77: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d⁷6s²",
  78: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d⁹6s¹",
  79: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s¹",
  80: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s²",
  81: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s²6p¹",
  82: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s²6p²",
  83: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s²6p³",
  84: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s²6p⁴",
  85: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s²6p⁵",
  86: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s²6p⁶",
  87: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s²6p⁶7s¹",
  88: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s²6p⁶7s²",
  89: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s²6p⁶6d¹7s²",
  90: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s²6p⁶6d²7s²",
  91: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f²6s²6p⁶6d¹7s²",
  92: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f³6s²6p⁶6d¹7s²",
  93: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f⁴6s²6p⁶6d¹7s²",
  94: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f⁶6s²6p⁶7s²",
  95: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f⁷6s²6p⁶7s²",
  96: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f⁷6s²6p⁶6d¹7s²",
  97: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f⁹6s²6p⁶7s²",
  98: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹⁰6s²6p⁶7s²",
  99: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹¹6s²6p⁶7s²",
  100: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹²6s²6p⁶7s²",
  101: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹³6s²6p⁶7s²",
  102: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹⁴6s²6p⁶7s²",
  103: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹⁴6s²6p⁶7s²7p¹",
  104: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹⁴6s²6p⁶6d²7s²",
  105: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹⁴6s²6p⁶6d³7s²",
  106: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹⁴6s²6p⁶6d⁴7s²",
  107: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹⁴6s²6p⁶6d⁵7s²",
  108: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹⁴6s²6p⁶6d⁶7s²",
  109: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹⁴6s²6p⁶6d⁷7s²",
  110: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹⁴6s²6p⁶6d⁸7s²",
  111: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹⁴6s²6p⁶6d⁹7s²",
  112: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹⁴6s²6p⁶6d¹⁰7s²",
  113: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹⁴6s²6p⁶6d¹⁰7s²7p¹",
  114: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹⁴6s²6p⁶6d¹⁰7s²7p²",
  115: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹⁴6s²6p⁶6d¹⁰7s²7p³",
  116: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹⁴6s²6p⁶6d¹⁰7s²7p⁴",
  117: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹⁴6s²6p⁶6d¹⁰7s²7p⁵",
  118: "1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹⁴6s²6p⁶6d¹⁰7s²7p⁶",
};

// 合并到元素数据
ELEMENTS.forEach((el) => { el.cfg = CFG[el.z]; });
