#!/usr/bin/env python3
# 项目结构验证脚本

import sys
import os
import importlib

# 添加项目路径
sys.path.append(os.path.join(os.path.dirname(__file__), 'src/backend'))

# 模块列表
services = [
    'services.system_management_service',
    'services.basic_info_service',
    'services.land_base_info_service',
    'services.account_management_service',
    'services.land_bidding_service',
    'services.contract_management_service',
    'services.fee_management_service',
    'services.financing_management_service',
]

routes = [
    'routes.system_management_routes',
    'routes.basic_info_routes',
    'routes.land_base_info_routes',
    'routes.account_management_routes',
    'routes.land_bidding_routes',
    'routes.contract_management_routes',
    'routes.fee_management_routes',
    'routes.financing_management_routes',
]

models = [
    'models.system_management',
    'models.basic_info',
    'models.land_base_info',
    'models.account_management',
    'models.land_bidding',
    'models.contract_management',
    'models.fee_management',
    'models.financing_management',
]

def test_imports(module_list, module_type):
    """测试模块导入"""
    print(f"\n===== 测试{module_type}导入 =====")
    success_count = 0
    fail_count = 0
    
    for module_name in module_list:
        try:
            module = importlib.import_module(module_name)
            print(f"✅ 成功导入: {module_name}")
            success_count += 1
        except ImportError as e:
            print(f"❌ 导入失败: {module_name} - {str(e)}")
            fail_count += 1
        except Exception as e:
            print(f"❌ 导入异常: {module_name} - {str(e)}")
            fail_count += 1
    
    print(f"\n{module_type}导入结果: 成功{success_count}个, 失败{fail_count}个")
    return fail_count == 0

def main():
    """主函数"""
    print("开始验证AKS项目结构...")
    print(f"Python版本: {sys.version}")
    print(f"当前工作目录: {os.getcwd()}")
    
    # 测试各模块导入
    services_ok = test_imports(services, '服务模块')
    routes_ok = test_imports(routes, '路由模块')
    models_ok = test_imports(models, '数据模型')
    
    # 测试主应用程序导入
    print("\n===== 测试主应用程序导入 =====")
    try:
        import main
        print("✅ 成功导入主应用程序: main.py")
        main_ok = True
    except Exception as e:
        print(f"❌ 导入主应用程序失败: {str(e)}")
        main_ok = False
    
    # 汇总结果
    print("\n===== 项目结构验证汇总 =====")
    if services_ok and routes_ok and models_ok and main_ok:
        print("✅ 项目结构验证成功! 所有模块均可正常导入。")
        return 0
    else:
        print("❌ 项目结构验证失败! 部分模块导入异常。")
        return 1

if __name__ == "__main__":
    sys.exit(main())