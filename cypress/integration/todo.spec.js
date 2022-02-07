/* eslint-disable no-undef */
/// <reference types="cypress" />

describe("bookkeeper", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("Should render hello world", () => {
    cy.get("#addgame").children().should("have.length", 8);
    cy.get("#addgame").children().get("[name='gamename']").should("exist");
    cy.get("#addgame").children().get("[name='gameauthor']").should("exist");
    cy.get("#addgame").children().get("[name='gameprice']").should("exist");
    cy.get("#addgame").children().get("[name='gamedesc']").should("exist");
    cy.get("textarea[name='gamedesc']").should("exist");
  });

  it("should submit the data to server", function () {
    cy.intercept({
      method: "POST",
      url: "/games",
    }).as("apiCheck");

    cy.get("#addgame").should("be.visible");
    cy.get("input[name='gamename']").type("Mario");
    cy.get("input[name='gameauthor']").type("Nintendo");
    cy.get("input[name='gameprice']").type("599");
    cy.get("input[name='gametags']").type("adventure, multiplayer");
    cy.get("input[name='forkids']").click();
    cy.get("textarea[name='gamedesc']").type(
      "Super Mario is a platform game series created by Nintendo based on and starring the fictional plumber Mario."
    );
    cy.get("select[name='gamerating']").select("3");

    cy.get("#addgame").submit();

    cy.wait("@apiCheck").then((interception) => {
      assert.isNotNull(interception.response.body, "server saved the data");
      assert.exists(interception.response.body.id);
      assert.equal(interception.response.body.gamename, "Mario");
    });
  });

  it("should clear the form after submitting", function () {
    cy.get("#addgame").should("be.visible");
    cy.get("input[name='gamename']").type("Titanfall");
    cy.get("input[name='gameauthor']").type("Respawn");
    cy.get("input[name='gameprice']").type("1299");
    cy.get("input[name='gametags']").type("FPS");
    cy.get("input[name='forkids']").click();
    cy.get("textarea[name='gamedesc']").type(
      "Titanfall is a series of video games that mainly feature first-person shooter games"
    );
    cy.get("select[name='gamerating']").select("5");

    cy.get("#addgame").submit();
    cy.wait(1000).then(() => {
      cy.get("input[name='gamename']").invoke("val").should("be.empty");
      cy.get("input[name='gameauthor']").should("be.empty");
      cy.get("input[name='gameprice']").should("be.empty");
      cy.get("input[name='gametags']").should("be.empty");
    });
  });

  it("should show previously stored elements on page on mount", () => {
    cy.get("table[id='table']").should("exist");
    cy.get("table[id='table']").should("be.visible");
    cy.get("thead > tr").children().should("have.length", 6);

    cy.get("tbody").children().should("have.length.at.least", 1);
  });

  it("should show default data in sorted order by name", () => {
    cy.get(".gamename").then((x) => {
      const temp = [];
      for (const el of x) {
        temp.push(el.innerText);
      }
      let sorted = true;
      for (let x = 0; x < temp.length - 1; x++) {
        if (temp[x] > temp[x + 1]) {
          sorted = false;
        }
      }
      assert.isTrue(sorted);
    });
  });

  it("should sort by price", () => {
    cy.intercept({
      method: "GET",
      url: "/games",
    }).as("apiCheck");

    cy.wait("@apiCheck").then(() => {
      cy.get("#sortbyprice")
        .click()
        .then(() => {
          cy.get(".gameprice").then((x) => {
            const temp = [];
            for (const el of x) {
              temp.push(Number(el.innerText));
            }
            let sorted = true;
            for (let x = 0; x < temp.length - 1; x++) {
              if (temp[x] < temp[x + 1]) {
                sorted = false;
              }
            }
            assert.isTrue(sorted);
          });
        });
    });
  });

  it("should toggle the sort order or prices if button clicked twice", () => {
    cy.intercept({
      method: "GET",
      url: "/games",
    }).as("apiCheck");

    cy.wait("@apiCheck").then(() => {
      // sort asc
      cy.get("#sortbyprice")
        .click()
        .then(() => {
          cy.get(".gameprice").then((x) => {
            const temp = [];
            for (const el of x) {
              temp.push(Number(el.innerText));
            }
            let sorted = true;
            for (let x = 0; x < temp.length - 1; x++) {
              if (temp[x] < temp[x + 1]) {
                sorted = false;
              }
            }
            assert.isTrue(sorted);
          });
        });

      // Desc
      cy.get("#sortbyprice")
        .click()
        .then(() => {
          cy.get(".gameprice").then((x) => {
            const temp = [];
            for (const el of x) {
              temp.push(Number(el.innerText));
            }
            let sorted = true;
            for (let x = 0; x < temp.length - 1; x++) {
              if (temp[x] > temp[x + 1]) {
                sorted = false;
              }
            }
            assert.isTrue(sorted);
          });
        });
    });
  });

  // rating sort
  it("should sort ratings", () => {
    cy.intercept({
      method: "GET",
      url: "/games",
    }).as("apiCheck");

    cy.wait("@apiCheck").then(() => {
      // sort asc
      cy.get("#sortbyrating")
        .click()
        .then(() => {
          cy.get(".gamerating").then((x) => {
            const temp = [];
            for (const el of x) {
              temp.push(Number(el.innerText));
            }

            let sorted = true;
            for (let x = 0; x < temp.length - 1; x++) {
              if (temp[x] < temp[x + 1]) {
                sorted = false;
              }
            }
            assert.isTrue(sorted);
          });
        });
    });
  });

  // rating sort and toggle
  it("should sort ratings and toggle", () => {
    cy.intercept({
      method: "GET",
      url: "/games",
    }).as("apiCheck");

    cy.wait("@apiCheck").then(() => {
      // sort asc
      cy.get("#sortbyrating")
        .click()
        .then(() => {
          cy.get(".gamerating").then((x) => {
            const temp = [];
            for (const el of x) {
              temp.push(Number(el.innerText));
            }

            let sorted = true;
            for (let x = 0; x < temp.length - 1; x++) {
              if (temp[x] < temp[x + 1]) {
                sorted = false;
              }
            }
            assert.isTrue(sorted);
          });
        });

      // sort desc
      cy.get("#sortbyrating")
        .click()
        .then(() => {
          cy.get(".gamerating").then((x) => {
            const temp = [];
            for (const el of x) {
              temp.push(Number(el.innerText));
            }

            let sorted = true;
            for (let x = 0; x < temp.length - 1; x++) {
              if (temp[x] > temp[x + 1]) {
                sorted = false;
              }
            }
            assert.isTrue(sorted);
          });
        });
    });
  });

  it("should search through table", () => {
    cy.intercept({
      method: "GET",
      url: "/games",
    }).as("apiCheck");

    cy.wait("@apiCheck").then(() => {
      cy.get("#searchbox").should("be.visible");
      cy.get("#searchbox").type("Mario");
      cy.get(".gamename").then((el) => {
        const t = [];
        for (const x of el) {
          t.push(x.innerText.toLowerCase());
        }
        const every = t.every((e) => e.startsWith("mario"));
        assert.isTrue(every);
      });

      // other check
      cy.get("#searchbox").clear();
      cy.get("#searchbox").type("titanfall");
      cy.get(".gamename").then((el) => {
        const t = [];
        for (const x of el) {
          t.push(x.innerText.toLowerCase());
        }
        const every = t.every((e) => e.startsWith("titanfall"));
        assert.isTrue(every);
      });
    });
  });
});
