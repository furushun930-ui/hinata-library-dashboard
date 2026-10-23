/**
 * ひなた電子図書館 利用構造分析 Webアプリ
 * Googleフォーム連携・自動分類版
 */

// ============================================================
// 1. 固定モデル
// ============================================================

const MODEL = {
  features: [
    "Q4","Q5","Q6","Q7","Q8","Q9","Q10","Q11",
    "Q12","Q13","Q14","Q15","Q16","Q17","Q18"
  ],

  scaler_mean: [
    3.708,3.27,3.306,2.69,2.796,3.356,3.11,3.112,
    2.992,3.33,3.716,2.276,3.84,3.842,3.396
  ],

  scaler_scale: [
    1.1413746098455149,
    1.244628458617271,
    1.2314073249741526,
    1.2624975249741526,
    1.2419275341178277,
    0.9946175144245145,
    1.1635720862928924,
    1.1556193144803353,
    1.131342565273666,
    1.0830974102083324,
    1.145139292837336,
    1.1330595747797212,
    1.2435433245367862,
    1.249414262764754,
    1.0075633975090605
  ],

  pca_components: [
    [
      0.2516469015412492,
      0.3455497115511279,
      0.3435886001970986,
      -0.3456417626317997,
      -0.2940182345058463,
      0.25835397178180336,
      0.2577838339103705,
      0.2598490112934903,
      0.3739877660239059,
      0.33113231471238175,
      0.035804181269031045,
      -0.048404997926851746,
      0.008998107723665352,
      0.01070845927973289,
      0.1981017153690818
    ],
    [
      0.1120155281490696,
      -0.22187763704539587,
      -0.23427118142992734,
      0.2222031096348965,
      0.17864814520496664,
      0.04202055806100852,
      0.1412289288995915,
      0.15047555764699516,
      0.0843385449864492,
      0.10232618223875938,
      0.33393188015951125,
      -0.3360202515468376,
      0.4377838346204636,
      0.4480617305962108,
      0.3511103648457054
    ]
  ],

  pca_explained_variance_ratio: [
    0.30391787544622895,
    0.25605302825083004
  ],

  centroids_z: {
    A: [
      0.648341038618476,0.8629081173293841,0.829944713883728,
      -0.8443580910869932,-0.8728367559464684,0.8405241088919584,
      0.9230197360798981,0.9414865140855306,1.1738266028015694,
      0.9214314341385377,0.5973072483656011,-0.65309893360538,
      0.45032608751978714,0.4402062761657107,0.8456043581042619
    ],

    B: [
      0.4748660039611005,-0.6551790936553707,-0.6637638251671052,
      0.6145826630929117,0.6126107690805079,-0.3465014024368656,
      -0.02617332077084513,-0.008417367731212634,0.037204389176966474,
      0.23039982571600334,0.1884645677325807,-0.20347160879892376,
      0.11038837534981813,0.1810302834876512,0.06938430979323308
    ],

    C: [
      -0.7604865155687,-1.1409027249606352,-1.125541461294372,
      1.1168338728261356,1.1305007429417324,-0.5087382764346059,
      0.19766716880668178,0.18864343756493146,-0.7707656608757287,
      -0.6924584925890825,0.11701633228214979,-0.12002899320315065,
      0.5709491466768728,0.5506580327309254,0.07344450997619202
    ],

    D: [
      0.07456224060160291,-0.013760280558453524,0.003528343138853778,
      0.04524875151174608,0.10872976002946828,-0.10368451719983929,
      -1.250311522032071,-1.2805394245417894,-0.5618794699603407,
      -0.3046817367391955,0.21789248080124482,-0.16243274502779317,
      0.38747269270996454,0.3748515136603568,-0.10782813114243
    ],

    E: [
      0.28364572766328694,0.5992736311860078,0.6795940919668552,
      -0.5842538564700042,-0.6920629745942326,0.15275872959508308,
      0.1373711794260376,0.136585870332436,0.10528297508394263,
      0.2522160985705414,-1.9143439491617142,1.969831558389521,
      -1.5307002385309778,-1.5378126668038867,-0.834135545735609
    ],

    F: [
      -1.9226697944362987,0.7385249652819034,0.6513751313968715,
      -0.7392040181845201,-0.6409391676507268,-0.6568326897755212,
      -0.8842760418884102,-0.8920921500715032,-0.8290556501063508,
      -1.502447777974364,-0.03521346667304731,0.04264941173434706,
      -1.6317800507232447,-1.6689766600142157,-1.5464656278843738
    ]
  },

  layer_names: {
    A: "定着利用層",
    B: "条件付き継続層",
    C: "利便性改善転換層",
    D: "コンテンツ改善転換層",
    E: "紙媒体志向固定層",
    F: "低認知・無関心層"
  }
};


// ============================================================
// 2. 基本設定
// ============================================================

// 回答スプレッドシート
const SPREADSHEET_ID =
  "1xJ4ifjQtCA_l2zVv05UqtrIdv26wT3XVgAGlk76bYic";

const LAYERS = ["A","B","C","D","E","F"];

const RESULT_COLUMNS = [
  "利用者層",
  "利用者層名",
  "PC1",
  "PC2",
  "最近傍距離",
  "第2候補",
  "判定状態"
];

const LAYER_DESCRIPTIONS = {
  A: "ひなた電子図書館を継続的に利用し、読書や学習の中に取り入れている層です。",
  B: "ひなた電子図書館の良さを感じた経験はあるものの、ログインや検索、画面操作などが負担となり、利用が続きにくい層です。",
  C: "現在の利用は少ないものの、登録・ログインや検索、スマートフォンでの操作が簡単になれば、利用を始めるきっかけが生まれる可能性のある層です。",
  D: "電子書籍を読むこと自体よりも、読みたい本や資料が見つからないことを課題に感じており、蔵書の充実を求めている層です。",
  E: "図書館への関心はある一方、読書では紙の本を好む層です。電子版の便利さを伝えるだけでは、利用につながりにくい場合があります。",
  F: "ひなた電子図書館の存在や使い方をまだよく知らない、または利用するきっかけが少ない層です。まずサービスを知ってもらうことが重要です。"
};


// ============================================================
// 3. 初期設定
// ============================================================

function setup() {

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  PropertiesService.getScriptProperties()
    .setProperty("SPREADSHEET_ID", SPREADSHEET_ID);

  const sheet = findResponseSheet_(ss);

  if (!sheet) {
    throw new Error("フォーム回答シートが見つかりません。");
  }

  const form = getLinkedForm_(ss);

  if (!form) {
    throw new Error(
      "このスプレッドシートに連携されたGoogleフォームを取得できませんでした。"
    );
  }

  // Googleフォームの設問を保存
  cacheSurveyDefinition_(form);

  // 判定列を追加
  ensureResultColumns_(sheet);

  // 既存回答を分類
  processAllResponses();

  // マップ更新
  updateMap_();

  // 古いトリガー削除
  ScriptApp.getProjectTriggers().forEach(function(trigger) {

    if (trigger.getHandlerFunction() === "onFormSubmit") {
      ScriptApp.deleteTrigger(trigger);
    }

  });

  // 新しいトリガー
  ScriptApp.newTrigger("onFormSubmit")
    .forSpreadsheet(ss)
    .onFormSubmit()
    .create();

  return "setup完了";
}


// ============================================================
// 4. Webアプリ
// ============================================================

function doGet() {

  return HtmlService
    .createHtmlOutputFromFile("Index")
    .setTitle("ひなた電子図書館 利用構造分析アンケート")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

}


// ============================================================
// 5. フォーム定義取得
// ============================================================

function getSurveyDefinition() {

  const form = getLinkedForm_();

  if (!form) {
    throw new Error("Googleフォームを取得できませんでした。");
  }

  const raw =
    PropertiesService.getScriptProperties()
      .getProperty("SURVEY_DEF");

  if (raw) {
    return JSON.parse(raw);
  }

  return cacheSurveyDefinition_(form);

}


// ============================================================
// 6. フォーム定義を保存
// ============================================================

function cacheSurveyDefinition_(form) {

  const items = [];
  let qn = 0;

  form.getItems().forEach(function(item) {

    const type = item.getType();
    let obj = null;

    // ラジオボタン
    if (type === FormApp.ItemType.MULTIPLE_CHOICE) {

      const x = item.asMultipleChoiceItem();

      obj = {
        q: "Q" + (++qn),
        title: x.getTitle(),
        required: x.isRequired(),
        kind: "radio",
        itemId: x.getId(),
        choices: x.getChoices().map(function(c) {
          return {
            value: c.getValue()
          };
        })
      };

    }

    // チェックボックス
    else if (type === FormApp.ItemType.CHECKBOX) {

      const x = item.asCheckboxItem();

      obj = {
        q: "Q" + (++qn),
        title: x.getTitle(),
        required: x.isRequired(),
        kind: "checkbox",
        itemId: x.getId(),
        choices: x.getChoices().map(function(c) {
          return {
            value: c.getValue()
          };
        })
      };

    }

    // 均等目盛
    else if (type === FormApp.ItemType.SCALE) {

      const x = item.asScaleItem();

      // getLowerBoundLabel / getUpperBoundLabel は使用しない
      obj = {
        q: "Q" + (++qn),
        title: x.getTitle(),
        required: x.isRequired(),
        kind: "scale",
        itemId: x.getId(),
        min: x.getLowerBound(),
        max: x.getUpperBound()
      };

    }

    // プルダウン
    else if (type === FormApp.ItemType.LIST) {

      const x = item.asListItem();

      obj = {
        q: "Q" + (++qn),
        title: x.getTitle(),
        required: x.isRequired(),
        kind: "list",
        itemId: x.getId(),
        choices: x.getChoices().map(function(c) {
          return {
            value: c.getValue()
          };
        })
      };

    }

    // 短文
    else if (type === FormApp.ItemType.TEXT) {

      const x = item.asTextItem();

      obj = {
        q: "Q" + (++qn),
        title: x.getTitle(),
        required: x.isRequired(),
        kind: "text",
        itemId: x.getId()
      };

    }

    // 長文
    else if (type === FormApp.ItemType.PARAGRAPH_TEXT) {

      const x = item.asParagraphTextItem();

      obj = {
        q: "Q" + (++qn),
        title: x.getTitle(),
        required: x.isRequired(),
        kind: "paragraph",
        itemId: x.getId()
      };

    }

    if (obj) {
      items.push(obj);
    }

  });

  const def = {
    title: form.getTitle(),
    description: form.getDescription() || "",
    items: items,
    formId: form.getId(),
    updatedAt: new Date().toISOString()
  };

  PropertiesService.getScriptProperties()
    .setProperty("SURVEY_DEF", JSON.stringify(def));

  PropertiesService.getScriptProperties()
    .setProperty("FORM_ID", form.getId());

  return def;

}


// ============================================================
// 7. フォーム回答送信
// ============================================================

function submitSurvey(payload) {

  if (!payload || !Array.isArray(payload.answers)) {
    throw new Error("回答データを受け取れませんでした。");
  }

  const lock = LockService.getScriptLock();

  lock.waitLock(30000);

  try {

    const ss = getDataSpreadsheet_();
    const form = getLinkedForm_(ss);

    if (!form) {
      throw new Error("Googleフォームを取得できませんでした。");
    }

    const def = getSurveyDefinition();

    const byQ = {};

    payload.answers.forEach(function(a) {

      if (a && a.q) {
        byQ[a.q] = a.value;
      }

    });

    const response = form.createResponse();

    def.items.forEach(function(it) {

      const v = byQ[it.q];

      if (v === undefined || v === null || v === "") {
        return;
      }

      const item = form.getItemById(Number(it.itemId));

      if (!item) {
        return;
      }

      // ラジオ
      if (it.kind === "radio") {

        response.withItemResponse(
          item.asMultipleChoiceItem()
            .createResponse(String(v))
        );

      }

      // プルダウン
      else if (it.kind === "list") {

        response.withItemResponse(
          item.asListItem()
            .createResponse(String(v))
        );

      }

      // チェックボックス
      else if (it.kind === "checkbox") {

        response.withItemResponse(
          item.asCheckboxItem()
            .createResponse(
              Array.isArray(v) ? v : [String(v)]
            )
        );

      }

      // 均等目盛
      else if (it.kind === "scale") {

        response.withItemResponse(
          item.asScaleItem()
            .createResponse(Number(v))
        );

      }

      // 短文
      else if (it.kind === "text") {

        response.withItemResponse(
          item.asTextItem()
            .createResponse(String(v))
        );

      }

      // 長文
      else if (it.kind === "paragraph") {

        response.withItemResponse(
          item.asParagraphTextItem()
            .createResponse(String(v))
        );

      }

    });

    response.submit();

    Utilities.sleep(1000);

    const sheet = findResponseSheet_(ss);

    ensureResultColumns_(sheet);

    const rowNum = sheet.getLastRow();

    const result = classifyRow_(sheet, rowNum);

    updateMap_();

    return {
      row: rowNum,
      layer: result.layer,
      layerName: MODEL.layer_names[result.layer],
      description: LAYER_DESCRIPTIONS[result.layer],
      pc1: result.pc1,
      pc2: result.pc2,
      distance: result.distance,
      second: result.second,
      secondName: MODEL.layer_names[result.second],
      counts: getLayerCounts_(sheet),
      total: getClassifiedCount_(sheet),
      map: getMapPoints_(sheet),
      variance: MODEL.pca_explained_variance_ratio
    };

  } finally {

    lock.releaseLock();

  }

}


// ============================================================
// 診断結果へのフィードバック保存
// ============================================================

function submitFeedback(payload) {
  if (!payload || !payload.feedback) {
    throw new Error("診断結果への評価を選択してください。");
  }

  const ss = getDataSpreadsheet_();
  const sheetName = "診断フィードバック";
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow([
      "送信日時", "回答シート行番号", "診断された利用者層",
      "診断結果への評価", "本人が選んだ利用者層", "自由記述"
    ]);
  }

  const allowedFeedback = ["合っている", "一部違う", "当てはまらない"];
  if (allowedFeedback.indexOf(String(payload.feedback)) === -1) {
    throw new Error("評価の選択内容が正しくありません。");
  }

  const allowedLayers = ["", "A", "B", "C", "D", "E", "F"];
  const selectedLayer = String(payload.selectedLayer || "");
  if (allowedLayers.indexOf(selectedLayer) === -1) {
    throw new Error("利用者層の選択内容が正しくありません。");
  }

  sheet.appendRow([
    new Date(),
    payload.responseRow || "",
    String(payload.diagnosedLayer || ""),
    String(payload.feedback),
    selectedLayer,
    String(payload.comment || "").slice(0, 2000)
  ]);

  return { success: true };
}


// ============================================================
// 8. 既存回答を一括分類
// ============================================================

function processAllResponses() {

  const sheet =
    findResponseSheet_(getDataSpreadsheet_());

  if (!sheet) {
    throw new Error("フォーム回答シートが見つかりません。");
  }

  ensureResultColumns_(sheet);

  for (
    let r = 2;
    r <= sheet.getLastRow();
    r++
  ) {

    classifyRow_(sheet, r);

  }

}


// ============================================================
// 9. フォーム送信時
// ============================================================

function onFormSubmit(e) {

  if (!e || !e.range) {
    return;
  }

  const sheet = e.range.getSheet();

  classifyRow_(sheet, e.range.getRow());

  updateMap_();

}


// ============================================================
// 10. 利用者層判定
// ============================================================

function classifyRow_(sheet, row) {

  const lastCol = sheet.getLastColumn();

  const headers =
    sheet
      .getRange(1, 1, 1, lastCol)
      .getValues()[0]
      .map(String);

  const values =
    sheet
      .getRange(row, 1, 1, lastCol)
      .getValues()[0];

  const x = [];

  // Q10～Q24
  for (let q = 10; q <= 24; q++) {

    const idx =
      findHeaderIndexByQ_(headers, "Q" + q);

    if (idx < 0) {

      return writeStatus_(
        sheet,
        row,
        "Q" + q + "列が見つかりません"
      );

    }

    let v = Number(values[idx]);

    if (
      !Number.isFinite(v) ||
      v < 1 ||
      v > 5
    ) {

      return writeStatus_(
        sheet,
        row,
        "回答不足（Q10～Q24）"
      );

    }

    // Q21は逆転
    if (q === 21) {
      v = 6 - v;
    }

    x.push(v);

  }

  // 標準化
  const z = x.map(function(v, i) {

    return (
      (v - MODEL.scaler_mean[i]) /
      MODEL.scaler_scale[i]
    );

  });

  // 距離
  const distances = {};

  LAYERS.forEach(function(layer) {

    const c = MODEL.centroids_z[layer];

    distances[layer] =
      Math.sqrt(
        z.reduce(function(sum, v, i) {

          return sum +
            Math.pow(v - c[i], 2);

        }, 0)
      );

  });

  // 近い順
  const sorted =
    LAYERS.slice().sort(function(a, b) {

      return distances[a] - distances[b];

    });

  const layer = sorted[0];
  const second = sorted[1];

  // PCA
  const pc1 =
    dot_(z, MODEL.pca_components[0]);

  const pc2 =
    dot_(z, MODEL.pca_components[1]);

  ensureResultColumns_(sheet);

  const ix =
    headerIndexes_(
      sheet
        .getRange(
          1,
          1,
          1,
          sheet.getLastColumn()
        )
        .getValues()[0]
        .map(String)
    );

  sheet
    .getRange(
      row,
      ix["利用者層"] + 1,
      1,
      7
    )
    .setValues([[
      layer,
      MODEL.layer_names[layer],
      pc1,
      pc2,
      distances[layer],
      second + " " + MODEL.layer_names[second],
      "判定済み"
    ]]);

  return {
    layer: layer,
    second: second,
    pc1: pc1,
    pc2: pc2,
    distance: distances[layer]
  };

}


// ============================================================
// 11. 利用構造マップ
// ============================================================

function updateMap_() {

  const ss = getDataSpreadsheet_();

  const sheet =
    findResponseSheet_(ss);

  if (!sheet) {
    return;
  }

  const map =
    ss.getSheetByName("利用構造マップ") ||
    ss.insertSheet("利用構造マップ");

  map.clear();

  const pts =
    getMapPoints_(sheet);

  const rows =
    pts.map(function(p) {

      return [
        p.pc1,
        p.pc2,
        p.layer
      ];

    });

  map
    .getRange(1, 1, 1, 3)
    .setValues([[
      "PC1",
      "PC2",
      "利用者層"
    ]]);

  if (rows.length) {

    map
      .getRange(
        2,
        1,
        rows.length,
        3
      )
      .setValues(rows);

  }

  const counts =
    LAYERS.map(function(l) {

      return [
        l + " " + MODEL.layer_names[l],
        pts.filter(function(p) {
          return p.layer === l;
        }).length
      ];

    });

  map
    .getRange(
      1,
      5,
      counts.length + 1,
      2
    )
    .setValues([
      ["利用者層", "人数"],
      ...counts
    ]);

  // 既存グラフ削除
  map
    .getCharts()
    .forEach(function(chart) {
      map.removeChart(chart);
    });

  // PC1×PC2散布図
  if (rows.length) {

    const chart =
      map
        .newChart()
        .asScatterChart()
        .addRange(
          map.getRange(
            1,
            1,
            rows.length + 1,
            2
          )
        )
        .setPosition(2, 8, 0, 0)
        .setOption(
          "title",
          "電子図書館 利用構造マップ"
        )
        .setOption(
          "hAxis",
          { title: "PC1" }
        )
        .setOption(
          "vAxis",
          { title: "PC2" }
        )
        .setOption(
          "legend",
          { position: "none" }
        )
        .setOption(
          "pointSize",
          6
        )
        .build();

    map.insertChart(chart);

  }

}


// ============================================================
// 12. Webアプリ用データ
// ============================================================



function getMapData() {

  const sheet = findResponseSheet_(getDataSpreadsheet_());

  const classified = getClassifiedCount_(sheet);

  // フォーム回答総数
  const responseTotal = Math.max(
    0,
    sheet.getLastRow() - 1
  );

  return {
    points: getMapPoints_(sheet),
    counts: getLayerCounts_(sheet),

    // 全回答者数
    responseTotal: responseTotal,

    // 実際にA～F判定できた人数
    classifiedTotal: classified,

    // 未判定
    unclassifiedTotal:
      Math.max(0, responseTotal - classified),

    variance: MODEL.pca_explained_variance_ratio
  };

}

// ============================================================
// 13. マップ点取得
// ============================================================

function getMapPoints_(sheet) {

  if (!sheet) {
    return [];
  }

  const lastCol =
    sheet.getLastColumn();

  const headers =
    sheet
      .getRange(1, 1, 1, lastCol)
      .getValues()[0]
      .map(String);

  const ix =
    headerIndexes_(headers);

  if (
    ix["利用者層"] === undefined ||
    ix["PC1"] === undefined ||
    ix["PC2"] === undefined
  ) {

    return [];

  }

  const lastRow =
    sheet.getLastRow();

  if (lastRow < 2) {
    return [];
  }

  const data =
    sheet
      .getRange(
        2,
        1,
        lastRow - 1,
        lastCol
      )
      .getValues();

  return data
    .map(function(r) {

      return {
        layer: String(
          r[ix["利用者層"]] || ""
        ),
        pc1: Number(
          r[ix["PC1"]]
        ),
        pc2: Number(
          r[ix["PC2"]]
        )
      };

    })
    .filter(function(p) {

      return (
        LAYERS.includes(p.layer) &&
        Number.isFinite(p.pc1) &&
        Number.isFinite(p.pc2)
      );

    });

}


// ============================================================
// 14. 集計
// ============================================================

function getLayerCounts_(sheet) {

  const pts =
    getMapPoints_(sheet);

  return LAYERS.reduce(
    function(obj, layer) {

      obj[layer] =
        pts.filter(function(p) {
          return p.layer === layer;
        }).length;

      return obj;

    },
    {}
  );

}


function getClassifiedCount_(sheet) {

  return getMapPoints_(sheet).length;

}


// ============================================================
// 15. 判定列
// ============================================================

function ensureResultColumns_(sheet) {

  const lastCol =
    sheet.getLastColumn();

  const headers =
    sheet
      .getRange(
        1,
        1,
        1,
        lastCol
      )
      .getValues()[0]
      .map(String);

  let col = lastCol + 1;

  RESULT_COLUMNS.forEach(function(name) {

    if (headers.indexOf(name) === -1) {

      sheet
        .getRange(1, col)
        .setValue(name);

      col++;

    }

  });

}


function writeStatus_(sheet, row, status) {

  ensureResultColumns_(sheet);

  const headers =
    sheet
      .getRange(
        1,
        1,
        1,
        sheet.getLastColumn()
      )
      .getValues()[0]
      .map(String);

  const col =
    headers.indexOf("判定状態");

  if (col >= 0) {

    sheet
      .getRange(row, col + 1)
      .setValue(status);

  }

}


// ============================================================
// 16. ヘッダー処理
// ============================================================

function headerIndexes_(headers) {

  const out = {};

  headers.forEach(function(h, i) {

    out[h] = i;

    const m =
      h.match(/^(Q\d+)(?::|\s|$)/);

    if (m) {
      out[m[1]] = i;
    }

  });

  return out;

}


function findHeaderIndexByQ_(headers, q) {

  const pattern =
    new RegExp(
      "^" + q + "(?::|\\s|$)"
    );

  return headers.findIndex(function(h) {

    return pattern.test(String(h));

  });

}


// ============================================================
// 17. スプレッドシート取得
// ============================================================

function getDataSpreadsheet_() {

  return SpreadsheetApp.openById(
    SPREADSHEET_ID
  );

}


// ============================================================
// 18. フォーム回答シート取得
// ============================================================

function findResponseSheet_(ss) {

  return ss
    .getSheets()
    .find(function(sheet) {

      return /フォームの回答|Form Responses/i
        .test(sheet.getName());

    }) || ss.getSheets()[0];

}


// ============================================================
// 19. Googleフォーム取得
// ============================================================

function getLinkedForm_(ss) {

  let id =
    PropertiesService
      .getScriptProperties()
      .getProperty("FORM_ID");

  if (!id) {

    const url =
      ss.getFormUrl();

    if (url) {

      const m =
        url.match(/[-\w]{20,}/);

      if (m) {

        id = m[0];

        PropertiesService
          .getScriptProperties()
          .setProperty(
            "FORM_ID",
            id
          );

      }

    }

  }

  if (!id) {
    return null;
  }

  return FormApp.openById(id);

}


// ============================================================
// 20. 数学
// ============================================================

function dot_(a, b) {

  return a.reduce(
    function(sum, v, i) {

      return sum + v * b[i];

    },
    0
  );

}