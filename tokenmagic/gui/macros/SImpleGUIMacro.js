const MyCompendium = 'TokenMagic-Fav';

const macroVersion = 'v0.1';
/* Simple GUI - Token Magic
Features
- Detect token selected/targered
- Realtime preview
Source: 
Icon: 
*/
//
let filterType;
(async () => {
    let msgtoken = ``;
    if (canvas.tokens.controlled != 0) {
        msgtoken = `<h2>Token Selected: <span style="color: darkred">${canvas.tokens.controlled[0].name}</span></h2>`;
        filterType = 'selected';
    } else if (game.user.targets.size != 0) {
        let t = game.user.targets.values().next().value;
        msgtoken = `<h2>Token Targered: <span style="color: darkred">${t.name}</span></h2>`;
        filterType = 'targered';
    } else {
        ui.notifications.warn("Select a token!");
        return;
    }

    let template =
        `<style>
  #tokenmagic-quickpreview header {
    background: #9c0972;
    border-radius: 0;    
    border: none;    
    margin-bottom: 2px;
    font-size: .75rem;
  }
  #tokenmagic-quickpreview form {
    margin-bottom: 30px;   
  }
  #tokenmagic-quickpreview .window-content {    
    height: 600px;    
  }  
  #tokenmagic-quickpreview .form-fields.buttons {
    justify-content: flex-start !important;
  }
  #tokenmagic-quickpreview .button {
    height: 35px;
    box-shadow: inset 0 0 0 1px #1111FF,inset 0 0 0 1.5px var(--tertiary),inset 0 0 0 1px #1111FF;
    font-size: 12px;
    padding: 0;
    background: #eb34b7;
    color: white;
    cursor: pointer;
  }
  #tokenmagic-quickpreview .button:hover {
    box-shadow: 0 0 4px red;
  }
  #tokenmagic-quickpreview .meuitem input[type="radio"] {
    opacity: 0;
    position: fixed;
    width: 0;  
  }
  #tokenmagic-quickpreview .minhalista {    
    display: inline-block;
    list-style-type: none; 
    text-align: left; 
    margin: 0; 
    padding: 0; 
    width: 100%;
  }
  #tokenmagic-quickpreview .meuitem {    
    display: inline-block;    
    padding: 2px; 
  }  
  #tokenmagic-quickpreview .meuitem label {    
    cursor: pointer;    
    margin: 0px 3px ;
    
    height: 100%;
    width: 100%;
    border-radius: 3px;
    font-size: 16px;
    font-family: "Signika", sans-serif;  
    background: #9c0972;        
    color: white;    
  }
  
  #tokenmagic-quickpreview .radios label i {
    margin-right: 5px;
    color: white;
    background: #eb34b7;
  }
  #tokenmagic-quickpreview .meuitem label:hover {
    box-shadow: 0 0 14px black;
  }
  #tokenmagic-quickpreview .meuitem input[type="radio"]:checked + label {
    background: rgba(0, 0, 150, 0.7);
  }
  #tokenmagic-quickpreview .dialog-button {
    height: 50px;
    background: #9c0972;
    color: white;
    justify-content: space-evenly;
    align-items: center;
    cursor: pointer;
  }

  </style>
  
  ${msgtoken}  
  
  
  <div class="form-fields">
  <ul class="minhalista">
    ${await loadMacroButton()}
  </ul>
  
  </div>
  
  

  <!------ Javascript ------->   
  <script>  
    ${await removeAll()}
    ${await loadMacros(filterType)}
  </script>`;

    new Dialog({
        title: `Token Magic - ${macroVersion}`,
        content: template,
        buttons: {
            yes: {
                icon: "<i class='fas fa-check'></i>",
                label: "Apply",
                callback: () => { }
            },
            clear: {
                icon: "<i class='fas fa-skull'></i>",
                label: "Clear",
                callback: async (html) => {
                    removeOnSelected(html);
                }
            }
        },
        default: "yes",
        close: html => {
        }
    }, { id: 'tokenmagic-quickpreview' }).render(true);
    //} ).render(true);  
})()

// ==============================
// Main
// ==============================


// ==============================
// Common Functions 
// ==============================
async function removeOnSelected() {
    await TokenMagic.deleteFilters(_token);
    await TokenMagic.deleteFiltersOnSelected(); // Delete all filters on the selected tokens/tiles
}

async function loadMacroButton() {
    const list_compendium = await game.packs.filter(p => p.entity == 'Macro');
    const inside = await list_compendium.filter(p => p.metadata.label == MyCompendium)[0].getContent();
    let msg = ``;
    let tmp;
    let counter = 1;

    inside.map((el) => {
        tmp = el.data.name.split(' ').join('');
        msg += `<li class="meuitem"><input type="radio" name="Type" id="${tmp.toLowerCase()}" value="${tmp}"><label for="${tmp.toLowerCase()}" onclick="effect${counter}(1)">${tmp}</label></li>`;
        counter += 1;
    });

    return msg;
}

async function loadMacros(filterType) {
    const list_compendium = await game.packs.filter(p => p.entity == 'Macro');
    const inside = await list_compendium.filter(p => p.metadata.label == MyCompendium)[0].getContent();
    let msg = ``;
    let tmp;
    let counter = 1;

    inside.map((el) => {
        let macro = el.data.command;
        if (filterType == 'selected') {
            macro = macro.replace("OnTargeted", "OnSelected");
        } else {
            macro = macro.replace("OnSelected", "OnTargeted");
        }
        tmp = el.data.name.split(' ').join('');
        msg += `async function effect${counter}() {`;
        msg += `await removeOnSelected();`;
        msg += `${macro}`;
        msg += `}`;
        counter += 1;
    });
    return msg;
}

function removeAll() {
    const clean = `async function removeOnSelected() {await TokenMagic.deleteFilters(_token);await TokenMagic.deleteFiltersOnSelected()}`;
    return clean;
}
