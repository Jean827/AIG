import json
from collections import defaultdict

# 读取JSON数据
def read_json_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# 分析需求数据
def analyze_requirements(data):
    # 存储系统结构的嵌套字典
    system_structure = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))
    
    # 存储用户角色信息
    user_roles = []
    
    # 当前上下文（当前系统、模块、一级功能）
    current_system = None
    current_module = None
    current_level1_func = None
    
    for item in data:
        # 检查是否是系统级别的描述
        if item.get('系统') and not isinstance(item['系统'], float):  # 排除NaN值
            # 检查是否是用户角色描述
            if '用户' in item['系统'] or '角色' in item['系统']:
                user_roles.append(item['系统'])
                continue
            
            # 更新当前系统
            current_system = item['系统'].strip()
            current_module = None
            current_level1_func = None
            
            # 如果当前项包含模块信息
            if item.get('模块') and not isinstance(item['模块'], float):
                current_module = item['模块'].strip()
                
                # 如果当前项包含一级功能
                if item.get('一级功能') and not isinstance(item['一级功能'], float):
                    current_level1_func = item['一级功能'].strip()
                    
                    # 如果当前项包含二级功能
                    if item.get('二级功能') and not isinstance(item['二级功能'], float):
                        system_structure[current_system][current_module][current_level1_func].append(
                            item['二级功能'].strip()
                        )
            
        # 如果是同一系统下的内容
        elif current_system:
            # 检查是否更新当前模块
            if item.get('模块') and not isinstance(item['模块'], float):
                current_module = item['模块'].strip()
                current_level1_func = None
            
            # 检查是否更新当前一级功能
            if item.get('一级功能') and not isinstance(item['一级功能'], float):
                current_level1_func = item['一级功能'].strip()
            
            # 添加二级功能
            if current_module and current_level1_func and item.get('二级功能') and not isinstance(item['二级功能'], float):
                system_structure[current_system][current_module][current_level1_func].append(
                    item['二级功能'].strip()
                )
    
    return system_structure, user_roles

# 生成需求分析报告
def generate_requirement_report(system_structure, user_roles):
    report = """# 新疆阿克苏智慧农业数字化运营管理平台 - 需求分析报告

## 一、项目概述
本项目是一个智慧农业数字化运营管理平台，涵盖业务管理、土地竞拍、移动端应用、POS收费和数据大屏等多个方面，旨在实现农业资源的数字化管理和运营。

"""
    
    # 添加系统列表
    report += "## 二、系统架构\n\n"
    report += "系统由6个主要部分组成：\n\n"

    # 添加各系统详细功能
    for system_idx, (system_name, modules) in enumerate(system_structure.items(), 1):
        # 提取系统编号和名称（如果有）
        system_display_name = system_name
        if system_name.startswith('一、') or system_name.startswith('二、') or \
           system_name.startswith('三、') or system_name.startswith('四、') or \
           system_name.startswith('五、') or system_name.startswith('六、'):
            system_display_name = system_name[2:].strip()
        
        report += f"### {system_idx}. {system_display_name}\n\n"
        
        # 添加模块和功能
        for module_name, level1_funcs in modules.items():
            report += f"#### 模块：{module_name}\n\n"
            
            for level1_func_name, level2_funcs in level1_funcs.items():
                report += f"##### 一级功能：{level1_func_name}\n\n"
                
                for func_idx, level2_func in enumerate(level2_funcs, 1):
                    # 如果功能以序号开头，保持原序号
                    if level2_func.startswith('（1）') or level2_func.startswith('（2）') or \
                       level2_func.startswith('（3）') or level2_func.startswith('（4）') or \
                       level2_func.startswith('（5）') or level2_func.startswith('（6）'):
                        report += f"{level2_func}\n"
                    else:
                        report += f"{func_idx}. {level2_func}\n"
                report += "\n"
    
    # 添加用户角色分析
    report += "## 三、用户角色分析\n\n"
    if user_roles:
        for role_info in user_roles:
            report += f"{role_info}\n\n"
    else:
        report += "暂未提取到用户角色信息\n\n"
    
    # 添加产品设计建议
    report += "## 四、产品设计建议\n\n"
    
    # 根据系统结构提出设计建议
    report += "### 1. 整体架构设计\n"
    report += "- 采用前后端分离架构，PC端使用B/S架构，移动端使用C/S架构\n"
    report += "- 建立统一的数据中心，确保各端数据一致性\n"
    report += "- 采用微服务架构，将不同系统模块解耦，提高系统可维护性\n\n"
    
    report += "### 2. 功能模块设计优先级\n"
    report += "- 核心业务：业务管理PC端（基本信息管理、土地基础信息、账户业务管理）\n"
    report += "- 对外服务：土地竞拍对外网站、微信小程序端\n"
    report += "- 辅助功能：手机APP端、POS机端、大屏端\n\n"
    
    report += "### 3. 技术选型建议\n"
    report += "- 后端：Java Spring Boot或Python Django\n"
    report += "- 前端PC：React或Vue.js\n"
    report += "- 移动端：React Native或Flutter\n"
    report += "- 数据库：MySQL + MongoDB\n"
    report += "- 地图服务：可考虑集成高德地图或百度地图API\n\n"
    
    report += "### 4. 用户体验优化\n"
    report += "- 针对不同用户角色设计个性化界面\n"
    report += "- 简化操作流程，特别是缴费和竞拍流程\n"
    report += "- 提供数据可视化功能，方便领导决策\n\n"
    
    report += "## 五、项目实施建议\n\n"
    report += "### 1. 实施步骤\n"
    report += "- 第一阶段：完成业务管理PC端核心功能开发\n"
    report += "- 第二阶段：开发土地竞拍网站和微信小程序\n"
    report += "- 第三阶段：开发手机APP、POS机端和大屏端\n"
    report += "- 第四阶段：系统集成测试和上线\n\n"
    
    report += "### 2. 项目管理建议\n"
    report += "- 采用敏捷开发方法论\n"
    report += "- 建立完善的需求变更管理机制\n"
    report += "- 重视用户培训和系统文档编写\n"
    
    return report

# 主函数
def main():
    # 读取数据
    data = read_json_file('requirement_data.json')
    
    # 分析需求
    system_structure, user_roles = analyze_requirements(data)
    
    # 生成报告
    report = generate_requirement_report(system_structure, user_roles)
    
    # 保存报告
    with open('requirement_analysis_report.md', 'w', encoding='utf-8') as f:
        f.write(report)
    
    print("需求分析报告已生成：requirement_analysis_report.md")
    
    # 输出系统结构摘要
    print("\n系统结构摘要：")
    for system_name, modules in system_structure.items():
        print(f"- {system_name}")
        for module_name in modules:
            print(f"  └─ 模块：{module_name}")

if __name__ == "__main__":
    main()