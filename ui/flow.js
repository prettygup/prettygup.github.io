// flow.js

var flows;

async function loadSteps(steps) {
  const stepPane = document.querySelector(".step-pane");
  const contentPane = document.querySelector(".content-pane");
  stepPane.innerHTML = "";
  contentPane.innerHTML = "";
  for (const [index, step] of steps?.entries()) {
    const { details } = step || [];
    const link = document.createElement("a");
    link.href = "#" + step.summary;
    link.classList.add(
      "list-group-item",
      "list-group-item-action",
      "step-item"
    );
    link.textContent = index + 1 + ". " + step.api;

    const content = document.createElement("div");
    const noteContent = document.createElement("div");
    content.id = step.summary;
    noteContent.id = 'test';
    content.classList.add("step-content", "p-4");
    noteContent.classList.add("step-content", "p-4");

    var mermaidDiv = document.createElement("description-div");
    var yamlDiv = document.createElement("description-yaml");
    var noteDiv = document.createElement("note-yaml");

    if (details && details?.length) {
      for (const [innerIndex, detail] of details.entries()) {
        var mermaidPane = document.createElement("description-mermaid");
        const { description, mermaid: mermaidGraph } = detail;
        let svg = ''
        if(mermaidGraph){
          let removeBacktick = mermaidGraph?.replace(/`/g, "");
            svg  = await mermaid.render(`summary${index}`, removeBacktick)?.svg;
        }
  
        mermaidPane.innerHTML =
          "<p>" +
          `${innerIndex + 1}) ${description}` +
          "<p>" +
          "<p>" +
          svg +
          "<p>";

        mermaidDiv.appendChild(mermaidPane);
      }
    }
    // yamlDiv.innerHTML =
    //   '<pre class="yaml-content">' +
    //   JSON.stringify(step.example.value, null, 2) +
    //   "</pre>";
    yamlDiv.innerHTML = step?.api === "form" ? '<div>'+'<pre class="yaml-content">'+'<xmp>'+step.example.value+'</xmp>'+'</pre>'+'<div class="flow-forms">'+step.example.value+'</div>'+'</div>'
      :'<pre class="yaml-content">' +
       JSON.stringify(step.example.value, null, 2) +
      "</pre>";
    content.innerHTML = "<div>" + "<h3>" + step.summary + "</h3>" + "</div>";
    content.appendChild(mermaidDiv);
    content.appendChild(yamlDiv);

    if (step.notes) {
      noteDiv.innerHTML = step?.api === "form" ? '<div>'+'<pre class="yaml-content">'+'<xmp>'+step.notes.value+'</xmp>'+'</pre>'+'<div class="flow-forms">'+step.notes.value+'</div>'+'</div>'
      :'<pre class="yaml-content" style="color: #000000; background-color:lightgray;">' +
       JSON.stringify(step.notes.value, null, 2) +
      "</pre>";
      noteContent.innerHTML = "<div><h3>Notes</h3></div>";
      noteContent.appendChild(noteDiv);
    }

    
    link.addEventListener("click", function (event) {
      event.preventDefault();
      document.querySelectorAll(".step-item").forEach(function (item) {
        item.classList.remove("active");
      });
      document.querySelectorAll(".step-content").forEach(function (content) {
        content.classList.remove("active");
        noteContent.classList.remove("active");
      });
      link.classList.add("active");
      content.classList.add("active");
      noteContent.classList.add("active");
    });
    stepPane.appendChild(link);
    contentPane.appendChild(content);
    if (step.notes) {
      contentPane.appendChild(noteContent);
    }
    
  }
}

function updateFlow() {
  var flowDropdown = document.getElementById("flow-dropdown");
  var selectedValue = flowDropdown.value;
  loadFlow(selectedValue);
}

async function loadFlow(flowName) {
  const flowSummary = document.getElementById("flow-summary");
  const flowDescription = document.getElementById("flow-description");
  flowSummary.innerHTML = "";
  flowDescription.innerHTML = "";
  let selectedFlow = flows.find((obj) => {
    if (obj["summary"] === flowName) return obj;
  });
  flowSummary.textContent = selectedFlow["summary"];
  // flowDescription.textContent = selectedFlow["details"]
  var mermaidDiv = document.createElement("description-div");
  if (selectedFlow?.["details"]) {
    for (const [index, detail] of selectedFlow["details"].entries()) {
      var mermaidPane = document.createElement("description-summary");
      const { description, mermaid: mermaidGraph } = detail;
      let svg
      if(mermaidGraph){
        let removeBacktick = mermaidGraph?.replace(/`/g, "");
          svg  = await mermaid.render(`summary${index}`, removeBacktick)?.svg;
      }
     
      mermaidPane.innerHTML =
        "<p>" + `${index + 1}) ${description}` + "<p>" + "<p>" + svg + "<p>";

      mermaidDiv.appendChild(mermaidPane);
    }
    //flowDescription.textContent.appendChild(mermaidDiv)
  }
  flowDescription.append(mermaidDiv);
  loadSteps(selectedFlow["steps"]);
}

function loadFlows(data) {
  flows = data;
  const flowDropdown = document.getElementById("flow-dropdown");
  flowDropdown.innerHTML = "";
  // Render the steps list
  flows.forEach((flow) => {
    var option = document.createElement("option");
    option.text = flow.summary;
    flowDropdown.add(option);
  });
  loadFlow(flows[0].summary);
}