"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Guilds = require("./guild");
const Profiles = require("./profiles");
const Notes = require("./notes");
Notes.sync();
Profiles.sync();
Guilds.sync();
