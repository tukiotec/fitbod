with open('build_full_catalog.py', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace('"primaryHead": "tay_truoc"', '"primaryHead": "tay_truoc_dai"')
code = code.replace('"primaryHead": "tay_sau"', '"primaryHead": "tay_sau_ngoai"')
code = code.replace('"primaryHead": "mong"', '"primaryHead": "co_mong"')
code = code.replace('"primaryHead": "bung_lien_suon"', '"primaryHead": "co_lien_suon"')
code = code.replace('"primaryHead": "bung_tren"', '"primaryHead": "co_bung"')
code = code.replace('"primaryHead": "bung_duoi"', '"primaryHead": "co_bung"')
code = code.replace('"primaryHead": "bung_loi"', '"primaryHead": "co_bung"')

with open('build_full_catalog.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("Patch applied to build_full_catalog.py")
