import Excel from "exceljs/modern.browser";
import jStat from "jStat";

const COLORS = {
  stats: { argb: "FF7CFFB9" },
  header: { argb: "FFFFA893" },
  row: [{ argb: "FFFFFFFF" }, { argb: "ffdcdcdc" }],
  workshops: [{ argb: "DDFFBB80" }, { argb: "DDD7FF76" }, { argb: "DD75FFBA" }],
  endpoints: [{ argb: "FFFFB364" }, { argb: "FFC9FF64" }, { argb: "FF06FF80" }],
  black: {
    argb: "FF000000"
  }
};

const FILLS = {
  stats: {
    type: "pattern",
    pattern: "solid",
    fgColor: COLORS.stats,
    bgColor: COLORS.black
  },
  header: {
    type: "pattern",
    pattern: "solid",
    fgColor: COLORS.header,
    bgColor: COLORS.black
  },
  row: [
    {
      type: "pattern",
      pattern: "solid",
      fgColor: COLORS.row[0],
      bgColor: COLORS.black
    },
    {
      type: "pattern",
      pattern: "solid",
      fgColor: COLORS.row[1],
      bgColor: COLORS.black
    }
  ],
  endpoints: [
    {
      type: "pattern",
      pattern: "solid",
      fgColor: COLORS.endpoints[0],
      bgColor: COLORS.black
    },
    {
      type: "pattern",
      pattern: "solid",
      fgColor: COLORS.endpoints[1],
      bgColor: COLORS.black
    },
    {
      type: "pattern",
      pattern: "solid",
      fgColor: COLORS.endpoints[2],
      bgColor: COLORS.black
    }
  ],
  workshops: [
    {
      type: "pattern",
      pattern: "solid",
      fgColor: COLORS.workshops[0],
      bgColor: COLORS.black
    },
    {
      type: "pattern",
      pattern: "solid",
      fgColor: COLORS.workshops[1],
      bgColor: COLORS.black
    },
    {
      type: "pattern",
      pattern: "solid",
      fgColor: COLORS.workshops[2],
      bgColor: COLORS.black
    }
  ]
};

const BORDER_STYLES = {
  thin: { style: "thin" },
  thick: { style: "thick" }
};

const BORDERS = {
  allThin: {
    top: BORDER_STYLES.thin,
    left: BORDER_STYLES.thin,
    bottom: BORDER_STYLES.thin,
    right: BORDER_STYLES.thin
  },
  allThick: {
    top: BORDER_STYLES.thick,
    left: BORDER_STYLES.thick,
    bottom: BORDER_STYLES.thick,
    right: BORDER_STYLES.thick
  }
};

export default {
  async exportEndpoints(options, questions, endpoints) {
    if (
      typeof options !== "object" ||
      options.sheets == null ||
      options.sheets.length === 0
    ) {
      throw new Error("Invalid options provided");
    }

    let workbook = new Excel.Workbook();
    if (options.sheets.includes("rdata")) {
      let sheet = workbook.addWorksheet("R Data");
      await this._exportRData(sheet, questions, endpoints);
    }
    if (options.sheets.includes("graphs")) {
      let sheet = workbook.addWorksheet("Graphs");
      await this._exportGraphs(sheet, questions, endpoints);
    }
    if (options.sheets.includes("workshops")) {
      let sheet = workbook.addWorksheet("All Workshops");
      await this._exportAllWorkshops(sheet, questions, endpoints);
    }

    return await workbook.xlsx.writeBuffer();
  },

  async _exportRData(sheet, questions, endpoints) {
    let columns = [
      {
        header: "Endpoint",
        key: "e"
      },
      {
        header: "Workshop",
        key: "w"
      },
      {
        header: "ID",
        key: "id"
      }
    ];

    let savedQuestionIds = [];
    let questionsData = {};
    for (let question of questions) {
      if (question.t !== "c") continue;

      columns.push({
        header: "PRE: " + question.n,
        key: "pre_" + question.id
      });
      columns.push({
        header: "POST: " + question.n,
        key: "post_" + question.id
      });

      savedQuestionIds.push(question.id);
      questionsData[question.id] = { pre_: [], post_: [] };
    }

    sheet.columns = columns;

    let averageRowData = {
      e: "Average:"
    };
    sheet.addRow(averageRowData);
    let medianRowData = {
      e: "Median:"
    };
    sheet.addRow(medianRowData);

    let rows = 3;
    let endpointRows = [];
    let workshopRows = [];
    for (let endpoint of endpoints) {
      let endpointRowRange = {
        from: rows + 1
      };

      for (let workshop of endpoint.workshops) {
        let workshopRowRange = {
          from: rows + 1
        };

        for (let personResponse of workshop.r) {
          let row = {
            e: endpoint.n,
            w: workshop.n,
            id: personResponse.p
          };

          for (let response of personResponse.r) {
            if (!(response.q in savedQuestionIds)) continue;

            let type = response.t === "PRE" ? "pre_" : "post_";
            row[type + response.q] = response.v;
          }

          sheet.addRow(row);
          rows++;
        }

        workshopRowRange.to = rows + 1;
        if (workshopRowRange.to !== workshopRowRange.from)
          workshopRows.push(workshopRowRange);
      }

      endpointRowRange.to = rows + 1;
      if (endpointRowRange.to !== endpointRowRange.from)
        endpointRows.push(endpointRowRange);
    }

    // Calculate average and median
    for (let questionId of savedQuestionIds) {
      for (let type of ["pre_", "post_"]) {
        let data = [];

        sheet.getColumn(type + questionId).eachCell((cell, rowNumber) => {
          if (rowNumber >= 4) {
            try {
              data.push(Number(cell.value));
            } catch (e) {
              console.error(e);
            }
          }
        });

        if (data.length === 0) data.push(0);
        averageRowData[type + questionId] = jStat.mean(data);
        medianRowData[type + questionId] = jStat.median(data);
      }
    }

    sheet.getRow(2).values = averageRowData;
    sheet.getRow(2).numFmt = "0.00";
    sheet.getRow(3).values = medianRowData;
    sheet.getRow(3).numFmt = "0";

    sheet.eachRow((row, index) => {
      row.border = BORDERS.allThin;
      if (index >= 4) {
        index -= 4;
        index %= FILLS.row.length;
        row.fill = FILLS.row[index];
      }
    });

    let row = sheet.getRow(1);
    row.fill = FILLS.header;
    row.border = {
      top: BORDER_STYLES.thin,
      bottom: BORDER_STYLES.thick,
      left: BORDER_STYLES.thin,
      right: BORDER_STYLES.thin
    };

    row = sheet.getRow(2);
    row.fill = FILLS.stats;
    row.border = BORDERS.allThin;
    row = sheet.getRow(3);
    row.fill = FILLS.stats;
    row.border = {
      top: BORDER_STYLES.thin,
      bottom: BORDER_STYLES.thick,
      left: BORDER_STYLES.thin,
      right: BORDER_STYLES.thin
    };

    let endpointCount = 0;
    for (let endpointRange of endpointRows) {
      let cell = sheet.getRow(endpointRange.from).getCell(1);

      let fillNumber = endpointCount;
      fillNumber %= FILLS.endpoints.length;
      let fillColor = FILLS.endpoints[fillNumber];

      cell.border = {
        top: BORDER_STYLES.thick,
        left: BORDER_STYLES.thin,
        bottom: BORDER_STYLES.thin,
        right: BORDER_STYLES.thick
      };
      cell.fill = fillColor;

      for (let i = endpointRange.from + 1; i < endpointRange.to; i++) {
        let cell = sheet.getRow(i).getCell(1);
        cell.border = {
          top: BORDER_STYLES.thin,
          left: BORDER_STYLES.thin,
          bottom: BORDER_STYLES.thin,
          right: BORDER_STYLES.thick
        };
        cell.fill = fillColor;
      }

      endpointCount++;
    }

    let workshopCount = 0;
    for (let workshopRange of workshopRows) {
      let cell = sheet.getRow(workshopRange.from).getCell(2);

      let fillNumber = workshopCount;
      fillNumber %= FILLS.workshops.length;
      let fillColor = FILLS.workshops[fillNumber];

      cell.border = {
        top: BORDER_STYLES.thick,
        left: BORDER_STYLES.thick,
        bottom: BORDER_STYLES.thin,
        right: BORDER_STYLES.thick
      };
      cell.fill = fillColor;

      for (let i = workshopRange.from + 1; i < workshopRange.to; i++) {
        let cell = sheet.getRow(i).getCell(2);
        cell.border = {
          top: BORDER_STYLES.thin,
          left: BORDER_STYLES.thick,
          bottom: BORDER_STYLES.thin,
          right: BORDER_STYLES.thick
        };
        cell.fill = fillColor;
      }

      workshopCount++;
    }

    let IDColumn = sheet.getColumn(3);
    IDColumn.eachCell((cell, rowNumber) => {
      if (rowNumber >= 4) {
        cell.border = {
          right: BORDER_STYLES.thick,
          left: BORDER_STYLES.thin,
          top: BORDER_STYLES.thin,
          bottom: BORDER_STYLES.thin
        };
      }
    });
  },

  async _exportGraphs(sheet, questions, endpoints) {},

  async _exportAllWorkshops(sheet, questions, endpoints) {}
};
