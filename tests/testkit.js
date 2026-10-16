(function (global) {
  "use strict";

  const registeredTests = [];

  function test(name, run) {
    registeredTests.push({ name: name, run: run });
  }

  function equal(actual, expected, message) {
    if (actual !== expected) {
      throw new Error((message ? message + ": " : "") + "expected " + expected + ", received " + actual);
    }
  }

  function deepEqual(actual, expected, message) {
    const actualText = JSON.stringify(actual);
    const expectedText = JSON.stringify(expected);
    if (actualText !== expectedText) {
      throw new Error((message ? message + ": " : "") + "expected " + expectedText + ", received " + actualText);
    }
  }

  function truthy(value, message) {
    if (!value) {
      throw new Error(message || "Expected a truthy value");
    }
  }

  function throws(run, expectedName) {
    let caught = null;
    try {
      run();
    } catch (error) {
      caught = error;
    }

    if (!caught) {
      throw new Error("Expected an error to be thrown");
    }
    if (expectedName && caught.name !== expectedName) {
      throw new Error("Expected " + expectedName + ", received " + caught.name);
    }
    return caught;
  }

  function renderResult(testResult) {
    const row = document.createElement("tr");
    const statusCell = document.createElement("td");
    const nameCell = document.createElement("td");
    const detailCell = document.createElement("td");

    row.className = testResult.passed ? "passed" : "failed";
    statusCell.textContent = testResult.passed ? "PASS" : "FAIL";
    nameCell.textContent = testResult.name;
    detailCell.textContent = testResult.detail;
    row.append(statusCell, nameCell, detailCell);
    document.querySelector("#test-results").appendChild(row);
  }

  function run() {
    const resultsBody = document.querySelector("#test-results");
    const summary = document.querySelector("#test-summary");
    resultsBody.replaceChildren();

    const results = registeredTests.map(function (registeredTest) {
      try {
        registeredTest.run();
        return { name: registeredTest.name, passed: true, detail: "" };
      } catch (error) {
        return { name: registeredTest.name, passed: false, detail: error.message };
      }
    });

    results.forEach(renderResult);
    const passed = results.filter(function (result) { return result.passed; }).length;
    const failed = results.length - passed;
    summary.textContent = failed === 0
      ? "All " + passed + " tests passed."
      : passed + " passed; " + failed + " failed (" + results.length + " total).";
    summary.className = failed === 0 ? "summary passed" : "summary failed";
    summary.setAttribute("role", "status");
    return { total: results.length, passed: passed, failed: failed };
  }

  global.TestKit = Object.freeze({
    test: test,
    equal: equal,
    deepEqual: deepEqual,
    truthy: truthy,
    throws: throws,
    run: run,
    count: function () { return registeredTests.length; }
  });
})(window);