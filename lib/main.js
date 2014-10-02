/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

let Buttons = require('sdk/ui/button/action');
let Tabs = require("sdk/tabs");
let Utils = require('sdk/window/utils');

function frame_script() {
  const Cu = this["C" + "omponents"].utils;
  Cu.import("resource://gre/modules/ctypes.jsm");

  let zero = new ctypes.intptr_t(8);
  let badptr = ctypes.cast(zero, ctypes.PointerType(ctypes.int32_t));
  badptr.contents;
}

let button = Buttons.ActionButton({
  id: "tab-crasher",
  label: "Crash the selected remote tab",
  icon: {
    "16": "./icon.svg",
    "32": "./icon.svg",
    "64": "./icon.svg"
  },
  onClick: function() {
    let activeWindow = Utils.getMostRecentBrowserWindow();
    if (!activeWindow.gMultiProcessBrowser) {
      activeWindow.alert("Tab crasher can only work in e10s windows. Sorry!");
      return;
    }

    let gBrowser = activeWindow.gBrowser;
    if (!gBrowser.selectedBrowser.isRemoteBrowser) {
      activeWindow.alert("Tab crasher can only work with a remote tab selected.");
      return;
    }

    let mm = gBrowser.selectedBrowser.messageManager;
    mm.loadFrameScript("data:,(" + frame_script.toString() + ")();", false);
  }
});
