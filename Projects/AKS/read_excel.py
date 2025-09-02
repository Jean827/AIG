import pandas as pd
import os
import json

# 设置文件路径
file_path = '/Users/Data/Cloud/AIG/Projects/AKS/docs/新疆阿克苏智慧农业数字化运营管理平台-V4.xls'

# 检查文件是否存在
if not os.path.exists(file_path):
    print(f"文件不存在: {file_path}")
    exit(1)

print(f"正在读取文件: {file_path}")
print(f"文件大小: {os.path.getsize(file_path)} 字节")

# 尝试读取Excel文件
try:
    # 读取完整的工作表数据
    df = pd.read_excel(file_path, sheet_name='功能规格说明', engine='xlrd')
    
    print(f"\n工作表: 功能规格说明")
    print(f"总行数: {len(df)}")
    print(f"总列数: {len(df.columns)}")
    
    # 清理数据 - 假设第一行是标题行
    # 设置正确的列名
    headers = df.iloc[0]
    df = df[1:].reset_index(drop=True)
    df.columns = headers
    
    print("\n正确的列名:")
    for col in df.columns:
        print(f"  - {col}")
    
    # 显示数据结构
    print("\n数据结构预览:")
    print(df.head(15))
    
    # 去除完全为空的行
    df_clean = df.dropna(how='all')
    print(f"\n清理后的数据行数: {len(df_clean)}")
    
    # 保存清理后的数据到JSON文件，便于后续分析
    cleaned_data = df_clean.to_dict(orient='records')
    with open('requirement_data.json', 'w', encoding='utf-8') as f:
        json.dump(cleaned_data, f, ensure_ascii=False, indent=2)
    
    print("\n数据已保存到 requirement_data.json 文件")
    
    # 分析功能模块
    print("\n===== 功能需求分析 ====")
    # 假设第二列是功能模块或功能名称
    if len(df_clean.columns) >= 2:
        second_col = df_clean.columns[1]
        print(f"\n功能列表 ({second_col}):")
        for i, row in df_clean.iterrows():
            if pd.notna(row[df_clean.columns[0]]) and pd.notna(row[second_col]):
                print(f"  {row[df_clean.columns[0]]}. {row[second_col]}")
    
    # 检查是否有更多详细信息的列
    if len(df_clean.columns) > 2:
        print("\n详细信息列:")
        for i, col in enumerate(df_clean.columns[2:], 1):
            print(f"  {i}. {col}")
            # 显示该列的一些示例值
            non_na_values = df_clean[col].dropna().unique()[:3]
            if len(non_na_values) > 0:
                print(f"    示例值: {', '.join([str(v) for v in non_na_values])}")
    
    # 简单的统计分析
    print("\n===== 数据统计 ====")
    # 计算每列的非空值数量
    for col in df_clean.columns:
        non_na_count = df_clean[col].count()
        print(f"{col}: {non_na_count} 个非空值")
    
except Exception as e:
    print(f"读取Excel文件时出错: {str(e)}")
    # 尝试使用xlrd直接读取
    try:
        import xlrd
        workbook = xlrd.open_workbook(file_path)
        sheet = workbook.sheet_by_index(0)
        print(f"\n使用xlrd直接读取成功!")
        print(f"工作表名称: {sheet.name}")
        print(f"行数: {sheet.nrows}")
        print(f"列数: {sheet.ncols}")
        
        # 读取所有数据并保存到JSON
        all_data = []
        headers = sheet.row_values(0)
        for row_idx in range(1, sheet.nrows):
            row_data = sheet.row_values(row_idx)
            if any([cell != '' for cell in row_data]):  # 跳过空行
                row_dict = {headers[i]: row_data[i] for i in range(min(len(headers), len(row_data)))}  # 避免索引越界
                all_data.append(row_dict)
        
        with open('requirement_data.json', 'w', encoding='utf-8') as f:
            json.dump(all_data, f, ensure_ascii=False, indent=2)
        
        print(f"\n已提取 {len(all_data)} 行有效数据并保存到 requirement_data.json")
        
        # 显示前15行数据
        print("\n前15行数据:")
        for i, row in enumerate(all_data[:15]):
            print(f"  行 {i+1}: {row}")
        
        # 分析功能模块
        print("\n===== 功能需求分析 ====")
        if headers and len(headers) >= 2:
            print(f"\n功能列表 ({headers[1]}):")
            for row in all_data:
                if headers[0] in row and headers[1] in row and row[headers[0]] and row[headers[1]]:
                    print(f"  {row[headers[0]]}. {row[headers[1]]}")
    except Exception as e2:
        print(f"使用xlrd直接读取也失败: {str(e2)}")