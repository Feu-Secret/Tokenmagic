
PlaceableObject.prototype.TMFXaddFilters = async function (paramsArray) {
    await window.TokenMagic.addFilters(this, paramsArray);
}

PlaceableObject.prototype.TMFXupdateFilters = async function (paramsArray) {
    await window.TokenMagic.updateFiltersByPlaceable(this, paramsArray);
}

PlaceableObject.prototype.TMFXaddUpdateFilters = async function (paramsArray) {
    await window.TokenMagic.addUpdateFilters(this, paramsArray);
}

PlaceableObject.prototype.TMFXdeleteFilters = async function (filterId = null) {
    await window.TokenMagic.deleteFilters(this, filterId);
}

PlaceableObject.prototype.TMFXhasFilterType = function (filterType) {
    return window.TokenMagic.hasFilterType(this, filterType);
}

PlaceableObject.prototype.TMFXhasFilterId = function (filterId) {
    return window.TokenMagic.hasFilterId(this, filterId);
}