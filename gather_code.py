import os

workspace_dir = r"c:\Users\Abrooo\Desktop\AgroVision\agrovision-ai"
output_file_path = os.path.join(workspace_dir, "agrovision_ai_full_codebase.txt")

exclude_dirs = {
    "node_modules",
    ".git",
    "__pycache__",
    "venv",
    "env",
    "dist",
    "build",
    "uploads"
}

exclude_files = {
    "package-lock.json",
    "gather_code.py",
    "agrovision_ai_full_codebase.txt",
    "maize_best.pt",
    "wheat_best.pt",
    ".DS_Store"
}

allowed_extensions = {
    ".js", ".jsx", ".py", ".json", ".html", ".css", ".md", ".txt", ".env"
}

def generate_file_tree(startpath):
    tree = []
    for root, dirs, files in os.walk(startpath):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        level = root.replace(startpath, '').count(os.sep)
        indent = ' ' * 4 * level
        folder_name = os.path.basename(root)
        if folder_name and folder_name != "agrovision-ai":
            tree.append(f"{indent}├── {folder_name}/")
        
        subindent = ' ' * 4 * (level + 1)
        for f in sorted(files):
            if f in exclude_files:
                continue
            ext = os.path.splitext(f)[1]
            if ext in allowed_extensions or f == ".env":
                tree.append(f"{subindent}└── {f}")
    return "\n".join(tree)

def gather_code():
    content_list = []
    
    # Header
    content_list.append("================================================================================")
    content_list.append("AGROVISION AI - COMPLETE CODEBASE REFERENCE")
    content_list.append("================================================================================")
    content_list.append("\nThis document contains the entire source code and project layout for the AgroVision AI system.")
    content_list.append("Use this file with AI systems to explain, debug, or extend the project.\n")
    
    # Description
    content_list.append("### Project Overview:")
    content_list.append("AgroVision AI is a bilingual (English & Amharic) crop disease detection platform focused on Maize and Wheat.")
    content_list.append("Architecture:")
    content_list.append("1. Frontend: React 19, Vite 8, Tailwind CSS v4, containing responsive components, voice guidance systems, and offline/fallback mock states.")
    content_list.append("2. Backend: Node.js + Express + MongoDB (Mongoose), handling authentication, user profiles, image upload/storage, scan history tracking, and coordinating calls to the ML model.")
    content_list.append("3. ML Microservice: Python FastAPI service serving PyTorch model (.pt) predictions for Maize and Wheat leaf diseases.")
    content_list.append("\n")
    
    # Directory Structure
    content_list.append("### Project Directory Structure:")
    content_list.append("```")
    content_list.append(generate_file_tree(workspace_dir))
    content_list.append("```")
    content_list.append("\n================================================================================\n")
    
    # Iterate through all files
    for root, dirs, files in os.walk(workspace_dir):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in sorted(files):
            if file in exclude_files:
                continue
            
            ext = os.path.splitext(file)[1]
            if ext not in allowed_extensions and file != ".env":
                continue
                
            filepath = os.path.join(root, file)
            relpath = os.path.relpath(filepath, workspace_dir)
            
            content_list.append(f"### File: {relpath}")
            content_list.append("=" * len(f"### File: {relpath}"))
            
            # Map extensions to markdown syntax highlighting languages
            lang = ""
            if ext == ".py":
                lang = "python"
            elif ext in [".js", ".jsx"]:
                lang = "javascript"
            elif ext == ".json":
                lang = "json"
            elif ext == ".css":
                lang = "css"
            elif ext == ".html":
                lang = "html"
            elif ext == ".md":
                lang = "markdown"
            
            content_list.append(f"```{lang}")
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    file_content = f.read()
                content_list.append(file_content)
            except Exception as e:
                content_list.append(f"[Error reading file: {str(e)}]")
            content_list.append("```")
            content_list.append("\n" + "=" * 80 + "\n")
            
    # Write to file
    with open(output_file_path, 'w', encoding='utf-8') as out_f:
        out_f.write("\n".join(content_list))

if __name__ == "__main__":
    gather_code()
    print("Codebase gathering complete!")
