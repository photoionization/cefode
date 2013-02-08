solutions = [
  { "name"        : "src",
    "url"         : "https://github.com/zcbenz/cefode-chromium.git",
    "deps_file"   : ".DEPS.git",
    "managed"     : True,
    "custom_deps" : {
      "src/third_party/WebKit/LayoutTests": None,
      "src/content/test/data/layout_tests/LayoutTests": None,
      "src/chrome/tools/test/reference_build/chrome_win": None,
      "src/chrome_frame/tools/test/reference_build/chrome_win": None,
      "src/chrome/tools/test/reference_build/chrome_linux": None,
      "src/chrome/tools/test/reference_build/chrome_mac": None,
      "src/third_party/hunspell_dictionaries": None,
    },
    "safesync_url": "",
  },
]
