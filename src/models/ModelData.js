import {Parse} from 'parse';

import {removeOddSpaces, filterSpecials} from 'utils/common';


export class SiteData {
  static get OriginClass() {return Parse.Object.extend("Site");}

  origin = null;

  domain = "";
  webhook = '';
  icon = null;

  //setter
  _name = "";
  _nameId = "";

  //links
  owner = null;

  //children
  collaborations = [];
  models = [];

  get name() {return this._name;}
  set name(name) {
    this._name = removeOddSpaces(name);
  }

  get nameId() {return this._nameId;}
  set nameId(nameId) {
    this._nameId = filterSpecials(nameId);
  }

  setOrigin(origin) {
    this.origin = origin;

    if (origin.get('name'))     this.name     = origin.get('name');
    if (origin.get('nameId'))   this.nameId   = origin.get('nameId');
    if (origin.get('domain'))   this.domain   = origin.get('domain');
    if (origin.get('webhook'))  this.webhook  = origin.get('webhook');
    if (origin.get('icon'))     this.icon     = origin.get('icon');

    return this;
  }

  updateOrigin() {
    if (!this.origin)
      this.origin = new SiteData.OriginClass;

    this.origin.set("name",     this.name);
    this.origin.set("nameId",   this.nameId);
    this.origin.set("domain",   this.domain);
    this.origin.set("webhook",  this.webhook);
    this.origin.set("icon",     this.icon);

    this.origin.set("owner",  this.owner.origin);
  }
}


export class ModelData {
  static get OriginClass() {return Parse.Object.extend("Model");}

  origin = null;

  description = "";
  tableName = "";
  color = "rgba(0, 0, 0, 1)";

  //setter
  _name = "";
  _nameId = "";

  //links
  site = null;

  //children
  fields = [];


  get name() {return this._name;}
  set name(name) {
    this._name = removeOddSpaces(name);
  }

  get nameId() {return this._nameId;}
  set nameId(nameId) {
    this._nameId = filterSpecials(nameId);
  }

  setOrigin(origin) {
    this.origin = origin;

    if (origin.get('name'))         this.name         = origin.get('name');
    if (origin.get('nameId'))       this.nameId       = origin.get('nameId');
    if (origin.get('description'))  this.description  = origin.get('description');
    if (origin.get('tableName'))    this.tableName    = origin.get('tableName');
    if (origin.get('color'))        this.color        = origin.get('color');

    return this;
  }

  updateOrigin() {
    if (!this.origin)
      this.origin = new ModelData.OriginClass;

    this.origin.set("name",         this.name);
    this.origin.set("nameId",       this.nameId);
    this.origin.set("description",  this.description);
    this.origin.set("tableName",    this.tableName);
    this.origin.set("color",        this.color);

    this.origin.set("site",         this.site.origin);
  }

  setTableName() {
    const email =
      encodeURIComponent(this.site.owner.email)
        .replace(/[!'()*.~_-]/g, c =>
          '%' + c.charCodeAt(0).toString(16)
        )
        .replace(/%/g, `_`);
    this.tableName = `ct__${email}__${this.site.nameId}__${this.nameId}`;
  }

  toJSON() {
    return {
      name:         this.name,
      nameId:       this.nameId,
      description:  this.description,
      tableName:    this.tableName,
      color:        this.color,
      fields:       this.fields
    };
  }
  
  hasTitle() {
    for (let field of this.fields) {
      if (field.isTitle)
        return true;
    }
    return false;
  }
}



export const FIELD_TYPE_SHORT_TEXT  = "Short Text";
export const FIELD_TYPE_LONG_TEXT   = "Long Text";
export const FIELD_TYPE_INTEGER     = "Number Int";
export const FIELD_TYPE_FLOAT       = "Number";
export const FIELD_TYPE_BOOLEAN     = "Boolean";
export const FIELD_TYPE_DATE        = "Date/time";
export const FIELD_TYPE_MEDIA       = "Media";
export const FIELD_TYPE_JSON        = "JSON";
export const FIELD_TYPE_REFERENCE   = "Reference";


export const FIELD_APPEARANCE__SHORT_TEXT__SINGLE   = "Single line";
export const FIELD_APPEARANCE__SHORT_TEXT__SLUG     = "Slug";
export const FIELD_APPEARANCE__SHORT_TEXT__URL      = "URL";
export const FIELD_APPEARANCE__SHORT_TEXT__DROPDOWN = "Dropdown";
export const FIELD_APPEARANCE__SHORT_TEXT__RADIO    = "Radio buttons";

export const FIELD_APPEARANCE__LONG_TEXT__SINGLE    = "Single line";
export const FIELD_APPEARANCE__LONG_TEXT__MULTI     = "Multi-line";
export const FIELD_APPEARANCE__LONG_TEXT__WYSIWIG   = "WYSIWYG";
export const FIELD_APPEARANCE__LONG_TEXT__MARKDOWN  = "Markdown";

export const FIELD_APPEARANCE__INTEGER__DECIMAL     = "Decimal";
export const FIELD_APPEARANCE__INTEGER__RATING      = "Rating";

export const FIELD_APPEARANCE__FLOAT__DECIMAL       = "Decimal";

export const FIELD_APPEARANCE__BOOLEAN__RADIO       = "Radio buttons";
export const FIELD_APPEARANCE__BOOLEAN__SWITCH      = "Switch";

export const FIELD_APPEARANCE__DATE__DATE           = "Date & time";

export const FIELD_APPEARANCE__MEDIA__MEDIA         = "Media";

export const FIELD_APPEARANCE__JSON__JSON           = "Date & time";

export const FIELD_APPEARANCE__REFERENCE_REFERENCE  = "Reference";


export const FIELD_TYPES = new Map([
  [FIELD_TYPE_SHORT_TEXT, [
    FIELD_APPEARANCE__SHORT_TEXT__SINGLE,
    FIELD_APPEARANCE__SHORT_TEXT__SLUG,
    FIELD_APPEARANCE__SHORT_TEXT__URL,
    //FIELD_APPEARANCE__SHORT_TEXT__DROPDOWN,
    //FIELD_APPEARANCE__SHORT_TEXT__RADIO,
  ]],
  [FIELD_TYPE_LONG_TEXT, [
    FIELD_APPEARANCE__LONG_TEXT__SINGLE,
    FIELD_APPEARANCE__LONG_TEXT__MULTI,
    //FIELD_APPEARANCE__LONG_TEXT__WYSIWIG,
    FIELD_APPEARANCE__LONG_TEXT__MARKDOWN
  ]],
  [FIELD_TYPE_INTEGER, [
    FIELD_APPEARANCE__INTEGER__DECIMAL,
    FIELD_APPEARANCE__INTEGER__RATING
  ]],
  [FIELD_TYPE_FLOAT, [
    FIELD_APPEARANCE__FLOAT__DECIMAL
  ]],
  [FIELD_TYPE_BOOLEAN, [
    FIELD_APPEARANCE__BOOLEAN__RADIO,
    FIELD_APPEARANCE__BOOLEAN__SWITCH
  ]],
  [FIELD_TYPE_DATE, [
    FIELD_APPEARANCE__DATE__DATE
  ]],
  [FIELD_TYPE_MEDIA, [
    FIELD_APPEARANCE__MEDIA__MEDIA
  ]],
  /*[FIELD_TYPE_JSON, [
    FIELD_APPEARANCE__JSON__JSON
  ]],*/
  [FIELD_TYPE_REFERENCE, [
    FIELD_APPEARANCE__REFERENCE_REFERENCE,
  ]]
]);

export function canBeTitle(field) {
  return field.type == FIELD_TYPE_SHORT_TEXT &&
    field.appearance == FIELD_APPEARANCE__SHORT_TEXT__SINGLE &&
    !field.isList && !field.isDisabled;
}

export function canBeList(field) {
  return (field.type == FIELD_TYPE_SHORT_TEXT && field.appearance == FIELD_APPEARANCE__SHORT_TEXT__SINGLE ||
    field.type == FIELD_TYPE_INTEGER && field.appearance == FIELD_APPEARANCE__INTEGER__DECIMAL ||
    field.type == FIELD_TYPE_FLOAT && field.appearance == FIELD_APPEARANCE__FLOAT__DECIMAL ||
    field.type == FIELD_TYPE_MEDIA && field.appearance == FIELD_APPEARANCE__MEDIA__MEDIA ||
    field.type == FIELD_TYPE_REFERENCE && field.appearance == FIELD_APPEARANCE__REFERENCE_REFERENCE) &&
    !field.isTitle;
}

export function canBeRequired(field) {
  return field.type != FIELD_TYPE_BOOLEAN;
}


export class ModelFieldData {
  static get OriginClass() {return Parse.Object.extend("ModelField");}

  origin = null;

  type = FIELD_TYPE_SHORT_TEXT;
  appearance = FIELD_APPEARANCE__SHORT_TEXT__SINGLE;
  color = "rgba(0, 0, 0, 1)";
  isRequired = false;
  isTitle = false;
  isList = false;
  isDisabled = false;
  order = -1;
  validations = null;

  //setter
  _name = "";
  _nameId = "";

  //links
  model = null;


  get name() {return this._name;}
  set name(name) {
    this._name = removeOddSpaces(name);
  }

  get nameId() {return this._nameId;}
  set nameId(nameId) {
    this._nameId = filterSpecials(nameId);
  }

  setOrigin(origin) {
    this.origin = origin;

    if (origin.get('name'))       this.name       = origin.get('name');
    if (origin.get('nameId'))     this.nameId     = origin.get('nameId');
    if (origin.get('type'))       this.type       = origin.get('type');
    if (origin.get('appearance')) this.appearance = origin.get('appearance');
    if (origin.get('color'))      this.color      = origin.get('color');
    if (origin.get('isRequired')) this.isRequired = true;
    if (origin.get('isTitle'))    this.isTitle    = true;
    if (origin.get('isList'))     this.isList     = true;
    if (origin.get('isDisabled')) this.isDisabled = true;

    if (origin.get('validations')) this.validations = origin.get('validations');
    
    if (origin.get('order') || origin.get('order') === 0)  this.order = origin.get('order');

    return this;
  }

  updateOrigin() {
    if (!this.origin)
      this.origin = new ModelFieldData.OriginClass;
    
    this.origin.set("name",       this.name);
    this.origin.set("nameId",     this.nameId);
    this.origin.set("type",       this.type);
    this.origin.set("appearance", this.appearance);
    this.origin.set("color",      this.color);
    this.origin.set("isRequired", this.isRequired);
    this.origin.set("isTitle",    this.isTitle);
    this.origin.set("isList",     this.isList);
    this.origin.set("isDisabled", this.isDisabled);
    this.origin.set("order",      this.order);
  
    this.origin.set("validations", this.validations);
    
    this.origin.set("model",      this.model.origin);
  }

  toJSON() {
    return {
      name:         this.name,
      nameId:       this.nameId,
      type:         this.type,
      appearance:   this.appearance,
      color:        this.color,
      isRequired:   this.isRequired,
      isTitle:      this.isTitle,
      isList:       this.isList,
      isDisabled:   this.isDisabled,
      order:        this.order,
      validations:  this.validations
    };
  }
}

export const FIELD_NAMES_RESERVED = ['objectId', `ACL`, 'createdAt', 'updatedAt', 't__color', `t__status`, 't__owner', 't__model'];
