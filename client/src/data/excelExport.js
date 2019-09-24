import Excel from "exceljs/modern.browser";
import jStat from "jStat";

export default {
  async exportWorkshops(options, questions, workshops) {
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
      await this._exportRData(sheet, questions, workshops);
    }
    if (options.sheets.includes("graphs")) {
      let sheet = workbook.addWorksheet("Graphs");
      await this._exportGraphs(sheet, questions, workshops);
    }
    if (options.sheets.includes("workshops")) {
      let sheet = workbook.addWorksheet("All Workshops");
      await this._exportAllWorkshops(sheet, questions, workshops);
    }
    if (options.sheets.includes("workshop")) {
      for (let workshop of workshops) {
        let dataSheet = workbook.addWorksheet("Data_" + workshop.n);
        await this._exportWorkshopData(dataSheet, questions, workshop);
        let diffSheet = workbook.addWorksheet("Diff_" + workshop.n);
        await this._exportWorkshopDiff(diffSheet, questions, workshop);
      }
    }

    return await workbook.xlsx.writeBuffer();
  },

  async _exportRData(sheet, questions, workshops) {
    sheet.columns = [
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

      sheet.columns.push({
        header: "PRE: " + question.n,
        key: "pre_" + question.id
      });
      sheet.columns.push({
        header: "POST: " + question.n,
        key: "post_" + question.id
      });

      savedQuestionIds.push(question.id);
      questionsData[question.id] = {pre_: null, post_: null};
    }

    let averageRow = {
      w: "Average:"
    };
    sheet.addRow(averageRow);

    for (let workshop of workshops) {
      for (let personResponse of workshop.r) {
        let row = {
          w: workshop.n,
          id: personResponse.p
        };

        for (let response of personResponse.r) {
          if (!(response.q in savedQuestionIds)) continue;

          let type = response.t === "PRE" ? "pre_" : "post_";
          row[type + response.q] = response.v;
          try {
            questionsData[response.q][type] = Number(response.v);
          } catch (e) {
            console.error(e);
          }
        }

        sheet.addRow(row);
      }
    }

    // Calculate average
    for (let questionId of savedQuestionIds) {
      for (let type of ["pre_", "post_"]) {
        averageRow[type + questionId] = jStat.mean(questionsData[questionId][type]);
      }
    }
  },

  async _exportGraphs(sheet, questions, workshops) {},

  async _exportAllWorkshops(sheet, questions, workshops) {},

  async _exportWorkshopData(sheet, questions, workshops) {},

  async _exportWorkshopDiff(sheet, questions, workshops) {}
};
