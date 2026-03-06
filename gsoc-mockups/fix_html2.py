#!/usr/bin/env python3
import os

files = ["explorer.html", "export.html", "lifecycle.html", "overview.html", "trace.html", "index.html"]

navbar_html = """<!-- Top Bar -->
<div id="Top Bar" class="appbar">
  <!-- Menu Icon -->
  <div id="Menu Icon" class="appbar-menu">
    <span class="mdi mdi-menu"></span>
  </div>

  <!-- Logo -->
  <div id="Logo" class="appbar-logo">
    <img id="Logo Text" src="../src/assets/logo_full_white.png" height="25" alt="RUXAILAB Logo">
  </div>

  <!-- Spacer -->
  <div id="Spacer" style="flex: 1"></div>

  <!-- Language Selector -->
  <div id="Language Selector" class="appbar-locale">
    <span id="Language Icon" class="mdi mdi-translate"></span>
    <div id="Language Labels" class="text-wrap">
      <span class="label">Language</span>
      <span class="val">English</span>
    </div>
    <span id="Language Chevron" class="mdi mdi-menu-down"></span>
  </div>

  <!-- Return to Console -->
  <div id="Return to Console Button" class="appbar-text-btn">Return to Console</div>

  <!-- Help Button -->
  <div id="Help Button" class="appbar-icon-btn">
    <span id="Help Icon" class="mdi mdi-help-circle-outline"></span>
  </div>

  <!-- Notifications -->
  <div id="Notifications" class="appbar-icon-btn">
    <span id="Bell Icon" class="mdi mdi-bell-outline"></span>
  </div>

  <!-- User Avatar -->
  <div id="User Avatar" class="appbar-avatar">
    <span>JT</span>
  </div>
  
  <!-- Dropdown Arrow -->
  <div id="Dropdown Arrow" class="appbar-icon-btn" style="margin-left:-8px">
    <span class="mdi mdi-chevron-down" style="font-size:20px; color:#90A4AE"></span>
  </div>
</div>"""

for fname in files:
    filepath = os.path.join("gsoc-mockups", fname)
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, "r") as f:
        content = f.read()

    # Replace old body start up to shell
    import re
    
    # 1. Clean anything between <body> and <div id="App Layout" / <div class="shell">
    pattern1 = re.compile(r'<body>.*?<div class="shell">', re.DOTALL)
    pattern2 = re.compile(r'<body>.*?<div id="App Layout" class="shell">', re.DOTALL)
    
    match1 = pattern1.search(content)
    match2 = pattern2.search(content)
    
    if match1:
        content = pattern1.sub(f'<body>\n\n{navbar_html}\n\n<!-- App Layout -->\n<div id="App Layout" class="shell">', content)
    elif match2:
        content = pattern2.sub(f'<body>\n\n{navbar_html}\n\n<!-- App Layout -->\n<div id="App Layout" class="shell">', content)

    # 2. Inject structural ids cleanly into Sidebar and Main Content
    if 'id="Sidebar"' not in content:
        content = content.replace('<aside class="drawer">', '<aside id="Sidebar" class="drawer">')
        content = content.replace('<div class="main">', '<div id="Main Content" class="main">')
        content = content.replace('<div class="sub-tabs">', '<div id="Tab Navigation" class="sub-tabs">')

    # Remove the generic <div id="Main Content" class="main"> if it existed as main-content
    content = content.replace('<div id="Main Content" class="main-content">', '<div id="Main Content" class="main">')
    content = content.replace('<div class="main-content">', '<div id="Main Content" class="main">')
    
    with open(filepath, "w") as f:
        f.write(content)

# Fix CSS
with open("gsoc-mockups/styles.css", "r") as f:
    css = f.read()

# Make sure icon buttons look correct
if ".appbar-icon-btn" not in css:
    css += """
.appbar-icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: 0.2s;
}
.appbar-icon-btn:hover {
  background: rgba(255,255,255,0.1);
}
"""

with open("gsoc-mockups/styles.css", "w") as f:
    f.write(css)

print("done rigorous html tweaks")
