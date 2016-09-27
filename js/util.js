function template(str) {
	return eval("`"+str+"`")
}

window.template=template