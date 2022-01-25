# mindtomd

## 使用场景

从xmind中复制节点的内容，通常为缩进格式。若有markdown文档输出需求，手动转换比较麻烦，因此有此脚本。

## 如何使用

**1、 运行项目**

```
yarn install
yarn dev
```

**2、生成markdown**

从xmind中复制节点内容到`src/input.md`文件中，在`src/output.md`文件中即可看到输出结果


例子说明：

`src/input.md`输入
```
level1 to h1
	level2 to h2
		 level3 to content 
			after level4 as description
	level2 to h2
		 level3 to content
			after level4 as description
		level3 to list item if more than one
			after level4 as description

```

`src/output.md`输出
```


# level1 to h1


## level2 to h2

**level3 to content**

after level4 as description


## level2 to h2

**1、 level3 to content**

after level4 as description

**2、 level3 to list item if more than one**

after level4 as description


```

## 特别说明

**1、输入格式要求**

- 输入内容必须满足缩进格式，可以是从xmind复制的节点内容或者类似格式的内容
- 输入内容必须只有一个1级节点，若输入带有多个1级节点，解析会不准确


**2、输出格式说明**

- 1级节点，输出格式为1级标题
- 2级节点，输出格式为2级标题 
- 3级节点，输出格式为内容，内容格式的说明
- 4级及以上节点，输出格式为内容说明
