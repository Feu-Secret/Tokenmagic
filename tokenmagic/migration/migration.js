import { TokenMagic, isTheOne, log, warn, error } from "../module/tokenmagic.js";
import { PresetsLibrary, templatePresets } from "../fx/presets/defaultpresets.js";

const Magic = TokenMagic();

export const DataVersion =
{
    ARCHAIC: "",
    V030: "0.3.0",
    V040: "0.4.0"
}

// migration function - will evolve constantly
export async function tmfxDataMigration() {
    if (isTheOne()) {
        var dataVersionNow;
        try {
            dataVersionNow = game.settings.get("tokenmagic", "migration");
        } catch (e) {
            dataVersionNow = DataVersion.ARCHAIC;
        }
        if (dataVersionNow < DataVersion.V030) {
            await updatePresetsV030();
        }
        if (dataVersionNow < DataVersion.V040) {
            await updatePresetsV040();
        }
    }
}

// migrating to the new presets data
async function updatePresetsV030() {
    var presets = game.settings.get("tokenmagic", "presets");

    if (!(presets == null)) {
        log(`Migration 0.3.0 - Launching presets data migration...`);

        let foundTemplateLibrary = false;

        for (const preset of presets) {
            if (!preset.hasOwnProperty("library")) {
                preset.library = PresetsLibrary.MAIN;
                log(`Migration 0.3.0 - Adding ${preset.name} to ${PresetsLibrary.MAIN}`);
            } else if (preset.library === PresetsLibrary.TEMPLATE && !foundTemplateLibrary) {
                foundTemplateLibrary = true;
                log(`Migration 0.3.0 - Found template presets. Templates will not be added.`);
            }
        }

        if (!foundTemplateLibrary) log(`Migration 0.3.0 - Merging templates presets.`)

        let newPresets =
            (foundTemplateLibrary ? presets : presets.concat(templatePresets));

        try {
            await game.settings.set("tokenmagic", "presets", newPresets);
            await game.settings.set("tokenmagic", "migration", DataVersion.V030);
            log(`Migration 0.3.0 - Migration successful!`);
        } catch (e) {
            error(`Migration 0.3.0 - Migration failed.`);
            error(e);
        }
    }
}

async function updatePresetsV040() {
    var presets = game.settings.get("tokenmagic", "presets");

    if (!(presets == null)) {
        log(`Migration 0.4.0 - Launching presets data migration...`);

        // Adding zOrder for the template presets only
        // Does not break visuals
        for (const preset of presets) {
            if (preset.library === PresetsLibrary.TEMPLATE) {
                log(`Migration 0.4.0 - Checking template preset ${preset.name}...`);
                let zOrder = 1;
                for (const filter of preset.params) {
                    if (!filter.hasOwnProperty("zOrder")) {
                        filter.zOrder = zOrder;
                        log(`Migration 0.4.0 - Updating ${filter.filterType} in ${preset.name}...`);
                        zOrder++;
                    }
                }
            }
        }

        try {
            await game.settings.set("tokenmagic", "presets", presets);
            log(`Migration 0.4.0 - Importing new template presets...`);
            await Magic.importPresetLibraryFromPath("/modules/tokenmagic/import/TMFX-update-presets-v040.json", {overwrite:false} );
            await game.settings.set("tokenmagic", "migration", DataVersion.V040);
            log(`Migration 0.4.0 - Migration successful!`);
        } catch (e) {
            error(`Migration 0.4.0 - Migration failed.`);
            error(e);
        }
    }
}