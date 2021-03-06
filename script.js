const exposants = ["\u2070","\u00B9","\u00B2","\u00B3","\u2074","\u2075","\u2076","\u2077","\u2078","\u2079","\u207A","\u207B"]
	const indices = ["\u2080","\u2081","\u2082","\u2083","\u2084","\u2085","\u2086","\u2087","\u2088","\u2089"]

	function ecriture(a){  
    	for (x=1;x<10;x++){
        		a = a.replace("#"+x.toString()+"+",exposants[x] + exposants[10])
        		a = a.replace("#"+x.toString()+"-",exposants[x] + exposants[11])
		}
    	for (x=0;x<10;x++) {
        		a = a.replace(x.toString(),indices[x])
		}
    	a = a.replace("#+",exposants[10])
    	a = a.replace("#-",exposants[11])
    	return a
	}
    
    function table1() {
        var rea = parseInt(document.getElementById("rea").value)
        var pro = parseInt(document.getElementById("pro").value)
        var vtot = parseFloat(document.getElementById("vtot").value)
        
        document.getElementById("reac").colSpan = rea.toString()
        document.getElementById("proc").colSpan = pro.toString()
        
        document.getElementById("tbody").innerHTML = ""
        var listx = ["Nom de l'espèce \n Ajouter un # pour l'exposant (ex : H3O#+)","Coefficient stoechiométrique","Quantité Initiale","Quantité Finale","Etat (aq,g,s,l)"]

        for (i=0; i<5; i++){
          var tr = document.createElement("tr")
          var th = document.createElement("th")
          th.innerHTML = listx[i]
          th.setAttribute("colspan","2")
          tr.appendChild(th)
          var somme = rea+pro
          for (y=0; y<somme; y++){
            var td = document.createElement("td")
            var input = document.createElement("input")
            input.setAttribute("onchange","table2()")
            
            td.appendChild(input)
            tr.appendChild(td)
          }
          document.getElementById("tbody").appendChild(tr)
          
        }
    }

    function table2() {
        var rea = parseInt(document.getElementById("rea").value)
        var pro = parseInt(document.getElementById("pro").value)
        var vtot = parseFloat(document.getElementById("vtot").value)

        var reactif = []
        var produit = []


        var trs = document.getElementById("tbody").getElementsByTagName("tr")
        for (i=0; i < trs.length ; i++){
            var tds = trs[i].getElementsByTagName("td")

            for (y=0; y < rea ; y++){
                var input = tds[y].getElementsByTagName("input")[0].value
                
                if (i==0){
                    input = ecriture(input)
                    tds[y].getElementsByTagName("input")[0].value = input
                    reactif[y] = [input]
                    
                }
                else{
                    reactif[y].push(input)
                }
            }

            for (y=rea; y < pro+rea ; y++){
                var input = tds[y].getElementsByTagName("input")[0].value
                if (i==0){
                    input = ecriture(input)
                    tds[y].getElementsByTagName("input")[0].value = input
                    produit[y-rea] = [input]
                }
                else{
                    produit[y-rea].push(input) 
                }
            }

        }
        var url = "rea=" + JSON.stringify(reactif) +"&pro=" + JSON.stringify(produit) +"&vtot=" + vtot.toString()
        var url = window.location.origin + window.location.pathname + "?" + url;
    	document.getElementById("lien").innerHTML = url
        document.getElementById("lien").href = url
        tableau(reactif,produit,rea,pro)
    }

    if(window.location.search != "" ){
        let searchParams = new URLSearchParams(window.location.search);
        var reactif = JSON.parse(searchParams.get("rea"))
        var produit = JSON.parse(searchParams.get("pro"))
        var vtot = parseFloat(searchParams.get("vtot"))
        
        var nrea = reactif.length
        var npro = produit.length

        document.getElementById("rea").value = nrea
        document.getElementById("pro").value = npro
        document.getElementById("vtot").value = vtot
        table1()

        for (i=0; i < nrea ; i++){
            document.getElementById("tbody").getElementsByTagName("tr")[0].getElementsByTagName("td")[i].getElementsByTagName("input")[0].value =  reactif[i][0]
            document.getElementById("tbody").getElementsByTagName("tr")[1].getElementsByTagName("td")[i].getElementsByTagName("input")[0].value =  reactif[i][1]
            document.getElementById("tbody").getElementsByTagName("tr")[2].getElementsByTagName("td")[i].getElementsByTagName("input")[0].value =  reactif[i][2]
            document.getElementById("tbody").getElementsByTagName("tr")[3].getElementsByTagName("td")[i].getElementsByTagName("input")[0].value =  reactif[i][3]
            document.getElementById("tbody").getElementsByTagName("tr")[4].getElementsByTagName("td")[i].getElementsByTagName("input")[0].value =  reactif[i][4]
        }

        for (i=nrea; i < npro+nrea ; i++){
            document.getElementById("tbody").getElementsByTagName("tr")[0].getElementsByTagName("td")[i].getElementsByTagName("input")[0].value =  produit[i-nrea][0]
            document.getElementById("tbody").getElementsByTagName("tr")[1].getElementsByTagName("td")[i].getElementsByTagName("input")[0].value =  produit[i-nrea][1]
            document.getElementById("tbody").getElementsByTagName("tr")[2].getElementsByTagName("td")[i].getElementsByTagName("input")[0].value =  produit[i-nrea][2]
            document.getElementById("tbody").getElementsByTagName("tr")[3].getElementsByTagName("td")[i].getElementsByTagName("input")[0].value =  produit[i-nrea][3]
            document.getElementById("tbody").getElementsByTagName("tr")[4].getElementsByTagName("td")[i].getElementsByTagName("input")[0].value =  produit[i-nrea][4]
        }

        table2()
    }

    function tableau(reactif,produit,nrea,npro){
        document.getElementById("tr0").innerHTML = "<td>Etat Initial E.I.</td><td>0</td>"
        document.getElementById("tr1").innerHTML = "<td>En cours de transformation</td><td>x</td>"
        document.getElementById("tr2").innerHTML = "<td>Etat Final E.F. Théorique</td><td>Xf = Xmax</td>"
        document.getElementById("tr3").innerHTML = "<td>Etat Final E.F.</td><td>Xf</td>"

        xmaxl = []
        reste = []

        for (i=0;i<nrea;i++){
        	xmaxl.push(reactif[i][2]/reactif[i][1])
        }

        var xmax = Math.min(...xmaxl)
        var xmax2 = Math.max(...xmaxl)

        for (i=0;i<nrea;i++){
        	reactif[i].push(reactif[i][2] - xmax * reactif[i][1])
        }


        if (xmax == xmax2){
        	limitant = "Proportion Stoechiométrique"
        }
        else{
        	limitant = "Le Réactif limitant est le " + reactif[xmaxl.indexOf(xmax)][0]
        }

        for (i=0;i<npro;i++){
        	xf = xmax * produit[i][1]
        	produit[i].push(xf)
        }

        document.getElementById("col1").colSpan = nrea + npro

        var tcol1 = reactif[0][1] + " x " + reactif[0][0]

        for (i=1;i<nrea;i++){
            tcol1 = tcol1 + " + " + reactif[i][1] + " x " + reactif[i][0]
        }

        tcol1 = tcol1 + " ==> " + produit[0][1] + " x " + produit[0][0]

        for (i=1;i<npro;i++){
            tcol1 = tcol1 + " + " + produit[i][1] + " x " + produit[i][0]
        }

        document.getElementById("col1").innerHTML = tcol1


        document.getElementById("col2").colSpan = nrea + npro

        for (i=0;i<nrea;i++){
            var td = document.createElement('td')
            var input = document.createElement('input')
            td.innerHTML = reactif[i][2]
        	document.getElementById("tr0").appendChild(td)
        }

        for (i=0;i<npro;i++){
        	var td = document.createElement('td')
          var input = document.createElement('input')
          td.innerHTML = produit[i][2]
        	document.getElementById("tr0").appendChild(td)
        }

        for (i=0;i<nrea;i++){
            var td = document.createElement('td')
            td.innerHTML = reactif[i][2].toString() + " - " + reactif[i][1].toString() + "x"
        	document.getElementById("tr1").appendChild(td)
        }

        for (i=0;i<npro;i++){
        	var td = document.createElement('td')
            td.innerHTML = produit[i][1].toString() + "x"
        	document.getElementById("tr1").appendChild(td)
        }
        
        for (i=0;i<nrea;i++){
            var td = document.createElement('td')
            td.innerHTML = reactif[i][5]
        	document.getElementById("tr2").appendChild(td)
        }

        for (i=0;i<npro;i++){
        	var td = document.createElement('td')
            var input = document.createElement('input')
            td.innerHTML = parseFloat(produit[i][5]) + parseFloat(produit[i][2])
        	document.getElementById("tr2").appendChild(td)
        }

        for (i=0;i<nrea;i++){
        	var td = document.createElement('td')
            var input = document.createElement('input')
            td.innerHTML = parseFloat(reactif[i][3])
        	document.getElementById("tr3").appendChild(td)
        }

        for (i=0;i<npro;i++){
        	var td = document.createElement('td')
            var input = document.createElement('input')
            td.innerHTML = parseFloat(produit[i][3])
        	document.getElementById("tr3").appendChild(td)
        }

        var xmax = xmaxl[0]
        var xf = parseFloat(produit[0][3])/parseFloat(produit[0][1])
        var t =  xf/xmax

        var qr = 1

        for (i=0;i<npro;i++){
        	if (produit[i][4] == "aq" || produit[i][4] == "g"){
                qr = qr * (parseFloat(produit[i][2])/vtot)**parseFloat(produit[i][1])
            }
        }

        for (i=0;i<nrea;i++){
        	if (reactif[i][4] == "aq" || reactif[i][4] == "g"){
                qr = qr / (parseFloat(reactif[i][2])/vtot)**parseFloat(reactif[i][1])
            }
        }

        document.getElementById("1tr0").innerHTML = "<td>xmax</td><td>" + xmax.toString() + "</td>"
        document.getElementById("1tr1").innerHTML = "<td>xf</td><td>" + xf.toString() + "</td>"
        document.getElementById("1tr2").innerHTML = "<td>𝜏</td><td>" + t.toString() + "</td>"
        document.getElementById("1tr3").innerHTML = "<td>limitant</td><td>" + limitant + "</td>"
        document.getElementById("1tr4").innerHTML = "<td>Qr,i</td><td>" + parseFloat(qr) + "</td>"
    }
