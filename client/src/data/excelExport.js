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

function formatAlternatingCells(sheet, rangeRows, fills, columnIndex) {
  let count = 0;
  for (let range of rangeRows) {
    let cell = sheet.getRow(range.from).getCell(columnIndex);

    let fillNumber = count;
    fillNumber %= fills.length;
    let fillColor = fills[fillNumber];

    cell.border = {
      top: BORDER_STYLES.thick,
      left: BORDER_STYLES.thin,
      bottom: BORDER_STYLES.thin,
      right: BORDER_STYLES.thick
    };
    cell.fill = fillColor;

    for (let i = range.from + 1; i < range.to; i++) {
      let cell = sheet.getRow(i).getCell(columnIndex);
      cell.border = {
        top: BORDER_STYLES.thin,
        left: BORDER_STYLES.thin,
        bottom: BORDER_STYLES.thin,
        right: BORDER_STYLES.thick
      };
      cell.fill = fillColor;
    }

    count++;
  }
}

async function exportRData(sheet, questions, endpoints) {
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

    savedQuestionIds.push(String(question.id));
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
          if (!savedQuestionIds.includes(String(response.q))) continue;

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
            let n = Number(cell.value);
            if (!isNaN(n)) data.push(n);
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

  formatAlternatingCells(sheet, endpointRows, FILLS.endpoints, 1);
  formatAlternatingCells(sheet, workshopRows, FILLS.workshops, 2);

  let IDColumn = sheet.getColumn(3);
  IDColumn.eachCell((cell, rowNumber) => {
    if (rowNumber > 4) {
      cell.border = {
        right: BORDER_STYLES.thick,
        left: BORDER_STYLES.thick,
        top: BORDER_STYLES.thin,
        bottom: BORDER_STYLES.thin
      };
    } else if (rowNumber === 1) {
      cell.border = {
        right: BORDER_STYLES.thick,
        left: BORDER_STYLES.thin,
        top: BORDER_STYLES.thin,
        bottom: BORDER_STYLES.thick
      };
    } else if (rowNumber === 4) {
      cell.border = {
        right: BORDER_STYLES.thick,
        left: BORDER_STYLES.thin,
        top: BORDER_STYLES.thick,
        bottom: BORDER_STYLES.thin
      };
    } else {
      cell.border = {
        right: BORDER_STYLES.thick,
        left: BORDER_STYLES.thin,
        top: BORDER_STYLES.thin,
        bottom: BORDER_STYLES.thin
      };
    }
  });
}

async function exportGraphs(sheet, questions, endpoints) {
  let firstHeaderValues = ["---", "--- \\ Question"];
  let secondHeaderValues = ["Endpoint", "Workshop \\ Statistic"];
  let columns = [{ key: "e" }, { key: "w" }];

  let OPERATIONS = [
    {
      operation: jStat.mean,
      name: "Mean",
      id: "mean"
    },
    {
      operation: jStat.median,
      name: "Median",
      id: "median"
    },
    {
      operation: jStat.max,
      name: "Max",
      id: "max"
    },
    {
      operation: jStat.min,
      name: "Min",
      id: "min"
    },
    {
      operation: jStat.meddev,
      name: "MAD",
      id: "mad"
    }
  ];
  let savedQuestionIds = [];
  let questionsData = {};
  for (let question of questions) {
    if (question.t !== "c") continue;

    firstHeaderValues.push("PRE: " + question.n);
    for (let i = 1; i < OPERATIONS.length; i++) firstHeaderValues.push("");

    firstHeaderValues.push("POST: " + question.n);
    for (let i = 1; i < OPERATIONS.length; i++) firstHeaderValues.push("");

    for (let operation of OPERATIONS) {
      columns.push({
        key: "pre_" + question.id + operation.id
      });
      secondHeaderValues.push(operation.name);
    }
    for (let operation of OPERATIONS) {
      columns.push({
        key: "post_" + question.id + operation.id
      });
      secondHeaderValues.push(operation.name);
    }

    savedQuestionIds.push(String(question.id));
    questionsData["pre_" + question.id] = [];
    questionsData["post_" + question.id] = [];
  }

  sheet.getRow(1).values = firstHeaderValues;
  let startingCell = 3;

  // eslint-disable-next-line no-unused-vars
  for (let _ of questions) {
    sheet.mergeCells(1, startingCell, 1, startingCell + OPERATIONS.length - 1);
    startingCell += OPERATIONS.length;
  }

  sheet.getRow(2).values = secondHeaderValues;
  sheet.columns = columns;

  let rows = 2;
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
      let row = {
        e: endpoint.n,
        w: workshop.n
      };

      for (let personResponse of workshop.r) {
        for (let response of personResponse.r) {
          if (!savedQuestionIds.includes(String(response.q))) continue;

          let type = response.t === "PRE" ? "pre_" : "post_";
          try {
            let n = Number(response.v);
            if (!isNaN(n)) questionsData[type + response.q].push(n);
          } catch (e) {
            console.error(e);
          }
        }
      }

      for (let questionId of savedQuestionIds) {
        let preData = questionsData["pre_" + questionId];
        let postData = questionsData["post_" + questionId];

        if (preData.length === 0) preData.push(0);
        if (postData.length === 0) postData.push(0);

        for (let operation of OPERATIONS) {
          row["pre_" + questionId + operation.id] = operation.operation(
            preData
          );
          row["post_" + questionId + operation.id] = operation.operation(
            postData
          );
        }

        questionsData["pre_" + questionId] = [];
        questionsData["post_" + questionId] = [];
      }

      sheet.addRow(row);
      rows++;

      workshopRowRange.to = rows + 1;
      if (workshopRowRange.to !== workshopRowRange.from)
        workshopRows.push(workshopRowRange);
    }

    endpointRowRange.to = rows + 1;
    if (endpointRowRange.to !== endpointRowRange.from)
      endpointRows.push(endpointRowRange);
  }

  sheet.eachRow((row, index) => {
    row.border = BORDERS.allThin;
    if (index >= 3) {
      index -= 3;
      index %= FILLS.row.length;
      row.fill = FILLS.row[index];
      row.numFmt = "0.00";
    }
  });

  let row = sheet.getRow(1);
  row.fill = FILLS.header;
  row.border = {
    top: BORDER_STYLES.thin,
    bottom: BORDER_STYLES.thin,
    left: BORDER_STYLES.thin,
    right: BORDER_STYLES.thick
  };
  row = sheet.getRow(2);
  row.fill = FILLS.header;
  row.border = {
    top: BORDER_STYLES.thin,
    bottom: BORDER_STYLES.thick,
    left: BORDER_STYLES.thin,
    right: BORDER_STYLES.thin
  };

  sheet.eachRow((row1, rowNumber) => {
    if (rowNumber >= 3) {
      row1.eachCell((cell, colNumber) => {
        if (colNumber < 3 || (colNumber - 2) % 5 === 0) {
          cell.border = {
            top: BORDER_STYLES.thin,
            bottom: BORDER_STYLES.thin,
            left: BORDER_STYLES.thin,
            right: BORDER_STYLES.thick
          };
        }
      });
    } else if (rowNumber === 2) {
      row1.eachCell((cell, colNumber) => {
        if (colNumber < 3 || (colNumber - 2) % 5 === 0) {
          cell.border = {
            top: BORDER_STYLES.thin,
            bottom: BORDER_STYLES.thick,
            left: BORDER_STYLES.thin,
            right: BORDER_STYLES.thick
          };
        }
      });
    }
  });

  formatAlternatingCells(sheet, endpointRows, FILLS.endpoints, 1);
  formatAlternatingCells(sheet, workshopRows, FILLS.workshops, 2);
}

async function exportAllData(sheet, questions, endpoints) {
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

  for (let question of questions) {
    columns.push({
      header: "PRE: " + question.n,
      key: "pre_" + question.id
    });
    columns.push({
      header: "POST: " + question.n,
      key: "post_" + question.id
    });
  }

  sheet.columns = columns;

  let rows = 1;
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

  sheet.eachRow((row, index) => {
    row.border = BORDERS.allThin;
    if (index >= 2) {
      index -= 2;
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

  formatAlternatingCells(sheet, endpointRows, FILLS.endpoints, 1);
  formatAlternatingCells(sheet, workshopRows, FILLS.workshops, 2);

  let IDColumn = sheet.getColumn(3);
  IDColumn.eachCell((cell, rowNumber) => {
    if (rowNumber > 1) {
      cell.border = {
        right: BORDER_STYLES.thick,
        left: BORDER_STYLES.thick,
        top: BORDER_STYLES.thin,
        bottom: BORDER_STYLES.thin
      };
    } else {
      cell.border = {
        right: BORDER_STYLES.thick,
        left: BORDER_STYLES.thin,
        top: BORDER_STYLES.thin,
        bottom: BORDER_STYLES.thick
      };
    }
  });
}

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
      await exportRData(sheet, questions, endpoints);
    }
    if (options.sheets.includes("graphs")) {
      let sheet = workbook.addWorksheet("Graphs");
      await exportGraphs(sheet, questions, endpoints);
    }
    if (options.sheets.includes("workshops")) {
      let sheet = workbook.addWorksheet("All Data");
      await exportAllData(sheet, questions, endpoints);
    }

    return await workbook.xlsx.writeBuffer();
  }
};
