#!/usr/bin/env python3
import os

files = ["explorer.html", "export.html", "lifecycle.html", "overview.html", "trace.html", "index.html"]

navbar_html = """
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
</div>
"""

for fname in files:
    filepath = os.path.join("gsoc-mockups", fname)
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, "r") as f:
        content = f.read()
        
    # We want to replace the entire <div class="appbar">...</div> with our perfectly clean one
    import re
    # Regular expression to match <div class="appbar"> up to </div>
    # Note: re.DOTALL ensures . matches newlines
    pattern = re.compile(r'<div class="appbar"[^>]*>.*?<div class="layout-body">', re.DOTALL)
    
    # We replace it with the new navbar + the layout-body div back
    new_content = pattern.sub(navbar_html + '\n<div class="layout-body">', content)
    
    # We also need to inject IDs into the main structural elements
    if 'id="App Layout"' not in new_content:
       new_content = new_content.replace('<div class="layout-body">', '<div id="App Layout" class="layout-body">')
       new_content = new_content.replace('<div class="sidebar">', '<div id="Sidebar" class="sidebar">')
       new_content = new_content.replace('<div class="main-content">', '<div id="Main Content" class="main-content">')
       new_content = new_content.replace('<div class="dashboard-container">', '<div id="Content Container" class="dashboard-container">')
       
       # Tab Navigation
       new_content = new_content.replace('<div class="sub-tabs">', '<div id="Tab Navigation" class="sub-tabs">')
       
       # Tabs Content blocks (Overview)
       new_content = new_content.replace('<!-- Overview Content -->', '<div id="Overview Content">', 1)

    with open(filepath, "w") as f:
        f.write(new_content)

print("done html tweaks")
