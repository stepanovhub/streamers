var STR = {
    HEADER_TOTAL_BUDGET: "Share Of Spend, руб.",
    HEADER_TOTAL_TRAFFIC: "Суммарный траффик",
    LABEL_DESKTOP: "Десктоп",
    LABEL_MOBILE: "Мобайл",
    HEADER_BUDGET: "Затраты, руб.",
    HEADER_BUDGET_MONTHS: "Затраты по месяцам, руб.",
    HEADER_TRAFFIC: "Трафик",
    HEADER_TRAFFIC_MONTHS: "Трафик по месяцам",
    HEADER_TOOLS_BUDGET_SPLIT: "Затраты по инструментам, руб.",
    HEADER_TOOLS_BUDGET_DYNAMICS: "Динамика затрат по инструментам, руб.",
    HEADER_BUDGET_AND_TRAFFIC: "Бюджет и трафик",
    LABEL_TOTAL_TRAFFIC: "Суммарный трафик",
    HEADER_TOOLS_TRAFFIC_SPLIT: "Трафик по инструментам",
    HEADER_TOOLS_TRAFFIC_DYNAMICS: "Динамика трафика по инструментам",
    TITLE_COLORSET: "Цветовая схема: ",
    MONTHS: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    MONTHS: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
    ERROR_NO_DATA: "Нет данных",
    LABEL_LOADING_1: "Загружается ",
    LABEL_LOADING_2: "-й отчет из ",
    LABEL_LOADING_3: ". Ждите. ",
    TITLE_COMPET: "Сравнительный отчет"
}

var Datepicker = {
    id: null,
    start: null,
    end: null,
    selected: null,
    init: function (id, array) {
        if (!array || (!array.length > 0)) {
            return;
        }
        this.id = id;
        this.start = 0;
        this.end = array.length - 1;
        for (var i = 0; i < array.length; i++) {
            var html = '<div data-index="' + i + '">';
            html += '<span class="month">' + array[i].getMon() + '</span> <span class="year">' + array[i].getYY();
            html += '</span></div>';
            var el = $(html);
            el.click(function (e) {
                Datepicker.current = $(this).data("index");
                if (Datepicker.selected == null) {
                    Datepicker.selected = Datepicker.current;
                    $(Datepicker.id + " div").removeClass("selected");
                    $(this).addClass("selected");
                } else {
                    if (Datepicker.current > Datepicker.selected) {
                        Datepicker.start = Datepicker.selected;
                        Datepicker.end = Datepicker.current;
                    } else {
                        Datepicker.start = Datepicker.current;
                        Datepicker.end = Datepicker.selected;
                    }
                    Datepicker.current = null;
                    Datepicker.selected = null;
                    $(Datepicker.id + " div").each(function (i, item) {
                        if ($(item).data("index") >= Datepicker.start && $(item).data("index") <= Datepicker.end) {
                            $(item).addClass("selected");
                        }
                    })
                    update();
                }
            });
            $(this.id).append(el);
        }
        $(Datepicker.id + " div").each(function (i, item) {
            if ($(item).data("index") >= Datepicker.start && $(item).data("index") <= Datepicker.end) {
                $(item).addClass("selected");
            }
        })
    }
}

var charts = {
    budgetMonths: {},
    budgetDoughnut: {},
    toolsBudgetBySites:{},
    create_toolsBudgetBySites: function(){
        var ctx = $("#tools-budget-by-sites")[0].getContext('2d');
        charts.toolsBudgetBySites = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: dss.toolsBudgetBySites.labels,
                datasets: dss.toolsBudgetBySites.datasets
            },
            options: Opt.toolsBudgetBySites
        });
    },
    toolsBudgetDynamics: {},
    create_toolsBudgetDynamics: function(){
        var ctx = $("#tools-budget-dynamics")[0].getContext('2d');
        charts.toolsBudgetDynamics = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dss.toolsBudgetDynamics.labels,
                datasets: dss.toolsBudgetDynamics.datasets
            },
            options: Opt.toolsBudgetDynamics
        });
    },
    trafficMonths: {},
    trafficDoughnut: {},
    toolsTrafficBySites:{},
    create_toolsTrafficBySites: function(){
        var ctx = $("#tools-traffic-by-sites")[0].getContext('2d');
        charts.toolsTrafficBySites = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: dss.toolsTrafficBySites.labels,
                datasets: dss.toolsTrafficBySites.datasets
            },
            options: Opt.toolsTrafficBySites
        });
    },
    toolsTrafficDynamics: {},
    create_toolsTrafficDynamics: function() {
        var ctx = $("#tools-traffic-dynamics")[0].getContext('2d');
        charts.toolsTrafficDynamics = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dss.toolsTrafficDynamics.labels,
                datasets: dss.toolsTrafficDynamics.datasets
            },
            options: Opt.toolsTrafficDynamics
        });
    }
}

function update () {
    dss.fillDatasets(Datepicker.start, Datepicker.end);
    if (dss.budgetMonths.datasets.length > 0) {
        // budget months
        if (charts.budgetMonths.data) {
            charts.budgetMonths.data.labels = dss.budgetMonths.labels;
            dss.budgetMonths.datasets.forEach(function (v, i) {
                if (v.label) {
                    charts.budgetMonths.data.datasets[i].label = v.label;
                }
                charts.budgetMonths.data.datasets[i].data = v.data;
                charts.budgetMonths.data.datasets[i].backgroundColor = v.backgroundColor;
                charts.budgetMonths.data.datasets[i].borderColor = v.borderColor;
            })
            charts.budgetMonths.update();
        }
        else {
            var ctx = $("#main-top")[0].getContext('2d');
            charts.budgetMonths = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dss.budgetMonths.labels,
                    datasets: dss.budgetMonths.datasets
                },
                options: Opt.budgetMonths
            });
        }

        // budget doughnut
        if (charts.budgetDoughnut.data) {
            charts.budgetDoughnut.data.labels = dss.budgetDoughnut.labels;
            dss.budgetDoughnut.datasets.forEach(function (v, i) {
                if (v.label) {
                    charts.budgetDoughnut.data.datasets[i].label = v.label;
                }
                charts.budgetDoughnut.data.datasets[i].data = v.data;
                charts.budgetDoughnut.data.datasets[i].backgroundColor = v.backgroundColor;
                charts.budgetDoughnut.data.datasets[i].borderColor = v.borderColor;
            })
            charts.budgetDoughnut.update();
        }
        else {
            var ctx = $("#budget-doughnut")[0].getContext('2d');
            charts.budgetDoughnut = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: dss.budgetDoughnut.labels,
                    datasets: dss.budgetDoughnut.datasets
                },
                options: Opt.budgetDoughnut
            });
        }
        fillSitesTables();

        // toolsBudgetBySite
        if (charts.toolsBudgetBySites.data) {
            charts.toolsBudgetBySites.data.labels = dss.toolsBudgetBySites.labels;
            dss.toolsBudgetBySites.datasets.forEach(function (v, i) {
                if (v.label) {
                    charts.toolsBudgetBySites.data.datasets[i].label = v.label;
                }
                charts.toolsBudgetBySites.data.datasets[i].data = v.data;
                charts.toolsBudgetBySites.data.datasets[i].backgroundColor = v.backgroundColor;
                charts.toolsBudgetBySites.data.datasets[i].borderColor = v.borderColor;
            })
            charts.toolsBudgetBySites.update();
        }
        else {
            charts.create_toolsBudgetBySites();
        }

        //budgetDynamics
        if (charts.toolsBudgetDynamics.data) {
            charts.toolsBudgetDynamics.data.labels = dss.toolsBudgetDynamics.labels;
            dss.toolsBudgetDynamics.datasets.forEach(function (v, i) {
                if (v.label) {
                    charts.toolsBudgetDynamics.data.datasets[i].label = v.label;
                }
                charts.toolsBudgetDynamics.data.datasets[i].data = v.data;
                charts.toolsBudgetDynamics.data.datasets[i].backgroundColor = v.backgroundColor;
                charts.toolsBudgetDynamics.data.datasets[i].borderColor = v.borderColor;
            })
            charts.toolsBudgetDynamics.update();
        }
        else {
            charts.create_toolsBudgetDynamics();
        }

        // TRAFFiC
        // traffic months
        if (charts.trafficMonths.data) {
            charts.trafficMonths.data.labels = dss.trafficMonths.labels;
            dss.trafficMonths.datasets.forEach(function (v, i) {
                if (v.label) {
                    charts.trafficMonths.data.datasets[i].label = v.label;
                }
                charts.trafficMonths.data.datasets[i].data = v.data;
                charts.trafficMonths.data.datasets[i].backgroundColor = v.backgroundColor;
                charts.trafficMonths.data.datasets[i].borderColor = v.borderColor;
            })
            charts.trafficMonths.update();
        }
        else {
            var ctx = $("#traffic-top")[0].getContext('2d');
            charts.trafficMonths = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dss.trafficMonths.labels,
                    datasets: dss.trafficMonths.datasets
                },
                options: Opt.trafficMonths
            });
        }

        // traffic doughnut
        if (charts.trafficDoughnut.data) {
            charts.trafficDoughnut.data.labels = dss.trafficDoughnut.labels;
            dss.trafficDoughnut.datasets.forEach(function (v, i) {
                if (v.label) {
                    charts.trafficDoughnut.data.datasets[i].label = v.label;
                }
                charts.trafficDoughnut.data.datasets[i].data = v.data;
                charts.trafficDoughnut.data.datasets[i].backgroundColor = v.backgroundColor;
                charts.trafficDoughnut.data.datasets[i].borderColor = v.borderColor;
            })
            charts.trafficDoughnut.update();
        }
        else {
            var ctx = $("#traffic-doughnut")[0].getContext('2d');
            charts.trafficDoughnut = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: dss.trafficDoughnut.labels,
                    datasets: dss.trafficDoughnut.datasets
                },
                options: Opt.trafficDoughnut
            });
        }
        fillSitesTables();

        // toolsTrafficBySite
        if (charts.toolsTrafficBySites.data) {
            charts.toolsTrafficBySites.data.labels = dss.toolsTrafficBySites.labels;
            dss.toolsTrafficBySites.datasets.forEach(function (v, i) {
                if (v.label) {
                    charts.toolsTrafficBySites.data.datasets[i].label = v.label;
                }
                charts.toolsTrafficBySites.data.datasets[i].data = v.data;
                charts.toolsTrafficBySites.data.datasets[i].backgroundColor = v.backgroundColor;
                charts.toolsTrafficBySites.data.datasets[i].borderColor = v.borderColor;
            })
            charts.toolsTrafficBySites.update();
        }
        else {
            charts.create_toolsTrafficBySites();
        }

        //trafficDynamics
        if (charts.toolsTrafficDynamics.data) {
            charts.toolsTrafficDynamics.data.labels = dss.toolsTrafficDynamics.labels;
            dss.toolsTrafficDynamics.datasets.forEach(function (v, i) {
                if (v.label) {
                    charts.toolsTrafficDynamics.data.datasets[i].label = v.label;
                }
                charts.toolsTrafficDynamics.data.datasets[i].data = v.data;
                charts.toolsTrafficDynamics.data.datasets[i].backgroundColor = v.backgroundColor;
                charts.toolsTrafficDynamics.data.datasets[i].borderColor = v.borderColor;
            })
            charts.toolsTrafficDynamics.update();
        }
        else {
            charts.create_toolsTrafficDynamics();
        }
    }
}

function setData() {

    if (!data || !(data.sites_ids) || !(data.sites_ids.length > 0)) {
        alert(JSON.stringify(data));
        $("#span-title").text(STR.ERROR_NO_DATA);
        return;
    }
    Colors.initColorsets();
    Chart.defaults.global.defaultFontColor = "#444";
    Chart.defaults.global.defaultFontFamily = 'Roboto';

    $("#p-colorset").text(STR.TITLE_COLORSET);
    $("#span-colorset").text(Colors.setTitle);
    $("#span-colorset").click(function () {
        Colors.nextColorset();
        $("#span-colorset").text(Colors.setTitle);
        update();
    });

    dss.getSites(data);
}

function fillToolsTables() {
    $("#table-tools").empty();
    $("#table-tools-traffic").empty();
    Ds.toolsBudget.forEach(function (tool) {
        var budgetDesktop = tool.budgets.desktop;
        var budgetMobile = tool.budgets.mobile;
        var str = '<tr>';
        str += '<th scope="row">' + tool.kind + '</th>';
        str += '<td>' + (budgetDesktop + budgetMobile).format(0, 3, ' ', '') + '</td>';
        str += '<td>' + budgetDesktop.format(0, 3, ' ', '') + '</td>';
        str += '<td>' + budgetMobile.format(0, 3, ' ', '') + '</td>';
        str += '</tr>';
        $("#table-tools").append(str);
    })
    Ds.toolsTraffic.forEach(function (tool) {
        var trafficDesktop = tool.traffic.desktop;
        var trafficMobile = tool.traffic.mobile;
        var str = '<tr>';
        str += '<th scope="row">' + tool.kind + '</th>';
        str += '<td>' + (trafficDesktop + trafficMobile).format(0, 3, ' ', '') + '</td>';
        str += '<td>' + trafficDesktop.format(0, 3, ' ', '') + '</td>';
        str += '<td>' + trafficMobile.format(0, 3, ' ', '') + '</td>';
        str += '</tr>';
        $("#table-tools-traffic").append(str);

    })
}

function fillSitesTables() {
    $("#table-sites-budget").empty();
    $("#table-sites-traffic").empty();

    var arr = [];
    for (var i = 0; i < dss.sites.length; i++){
        var s = dss.sites[i];
        if (!s.dbTotal) {
            continue;
        }
        arr.push({
            title: s.title,
            mb: s.mbTotal,
            db: s.dbTotal,
            mv: s.mvTotal,
            dv: s.dvTotal
        });
    }
    arr.sort(function(a, b){
        return (a.mb + a.db) > (b.mb + b.db) ? -1 : 1;
    })
    for (var i = 0; i < arr.length; i++){
        var s = arr[i];
        var str = '<tr>';
        str += '<th scope="row">' + s.title + '</th>';
        str += '<td>' + (s.mb + s.db).format(0, 3, ' ', '') + '</td>';
        str += '<td>' + s.db.format(0, 3, ' ', '') + '</td>';
        str += '<td>' + s.mb.format(0, 3, ' ', '') + '</td>';
        str += '</tr>';
        $("#table-sites-budget").append(str);
    }
    arr.sort(function(a, b){
        return (a.mv + a.dv) > (b.mv + b.dv) ? -1 : 1;
    })
    for (var i = 0; i < arr.length; i++){
        var s = arr[i];
        var str = '<tr>';
        str += '<th scope="row">' + s.title + '</th>';
        str += '<td>' + (s.mv + s.dv).format(0, 3, ' ', '') + '</td>';
        str += '<td>' + s.dv.format(0, 3, ' ', '') + '</td>';
        str += '<td>' + s.mv.format(0, 3, ' ', '') + '</td>';
        str += '</tr>';
        $("#table-sites-traffic").append(str);
    }
}

var dss = {
    sites: [],
    numSites: 0,
    loadedSites: 0,

    months: [],

    budgetMonths: {
        labels: [],
        datasets: []
    },
    budgetDoughnut: {},
    toolsBudgetBySites: {
        labels: [],
        datasets: []
    },
    toolsBudgetDynamics: {
        labels: [],
        datasets: []
    },

    trafficMonths: {
        labels: [],
        datasets: []
    },
    trafficDaughnut: {
        labels: [],
        datasets: []
    },
    toolsTrafficBySites: {
        labels: [],
        datasets: []
    },
    toolsTrafficDynamics: {
        labels: [],
        datasets: []
    },

    getSites: function (data) {
        this.numSites = data.sites_ids.length;
        $("#span-title").text(STR.LABEL_LOADING_1 + (dss.loadedSites + 1) + STR.LABEL_LOADING_2 + dss.numSites + STR.LABEL_LOADING_3);
        for (var i = 0; i < data.sites_ids.length; i++) {
            $.ajax({
                url: '/ru/s/ascalon/totalsite/?site__id__exact=' + data.sites_ids[i] + '&is_test=1&is_json=1',
                success: function (data) {
                    dss.addSite (data);
                    dss.loadedSites++;
                    if (dss.numSites > dss.loadedSites) {
                        $("#span-title").text(STR.LABEL_LOADING_1 + (dss.loadedSites + 1) + STR.LABEL_LOADING_2 + dss.numSites + STR.LABEL_LOADING_3);
                    }
                    else {
                        $("#span-title").text(STR.TITLE_COMPET);
                        dss.fillMonths();
                        Datepicker.init("#datepicker", dss.months);
                        update();

                        $("#tools-budget-by-sites-checkbox").change(function(){
                            Opt.toolsBudgetBySites.plugins.stacked100.enable = $("#tools-budget-by-sites-checkbox").prop("checked");
                            charts.toolsBudgetBySites.destroy();
                            charts.create_toolsBudgetBySites();
                        });
                        $("#tools-budget-dynamics-checkbox").change(function(){
                            Opt.toolsBudgetDynamics.plugins.stacked100.enable = $("#tools-budget-dynamics-checkbox").prop("checked");
                            charts.toolsBudgetDynamics.destroy();
                            charts.create_toolsBudgetDynamics();
                        });
                        $("#tools-traffic-by-sites-checkbox").change(function(){
                            Opt.toolsTrafficBySites.plugins.stacked100.enable = $("#tools-traffic-by-sites-checkbox").prop("checked");
                            charts.toolsTrafficBySites.destroy();
                            charts.create_toolsTrafficBySites();
                        });
                        $("#tools-traffic-dynamics-checkbox").change(function(){
                            Opt.toolsTrafficDynamics.plugins.stacked100.enable = $("#tools-traffic-dynamics-checkbox").prop("checked");
                            charts.toolsTrafficDynamics.destroy();
                            charts.create_toolsTrafficDynamics();
                        });
                    }
                },
                error: function (data) {
                    alert("ERROR:\n\r" + JSON.stringify(data));
                }
            });
        }
    },

    addSite: function (data) {
        if(!data){
            return;
        }
        if(!data.months){
            return;
        }
        dss.sites.push({
            title: data.site,
            data: data
        });
    },

    fillMonths: function () {
        this.months = [];
        for (var is = 0; is < this.sites.length; is++) {
            var s = this.sites[is];
            if (this.months.length == 0) {
                for (var i = 0; i < s.data.months.length; i++) {
                    this.months.push(s.data.months[i].month);
                }
            }
            else if (s.data.months){
                for (var i = 0; i < s.data.months.length; i++) {
                    if (monthCompare(s.data.months[i].month, this.months[this.months.length - 1]) > 0) {
                        this.months.push(s.data.months[i].month);
                    }
                }
                for (var i = s.data.months.length - 1; i >= 0; i--) {
                    if (monthCompare(s.data.months[i].month, this.months[0]) < 0) {
                        this.months.unshift(s.data.months[i].month);
                    }
                }
            }
        }
    },

    fillDatasets: function (start, end) {
        this.budgetMonths.labels = [];
        this.toolsBudgetDynamics.labels = [];
        this.trafficMonths.labels = [];
        this.toolsTrafficDynamics.labels = [];
        for (var i = start; i<= end; i++) {
            this.budgetMonths.labels.push(this.months[i].getMonYY());
            this.toolsBudgetDynamics.labels.push(this.months[i].getMonYY());
            this.trafficMonths.labels.push(this.months[i].getMonYY());
            this.toolsTrafficDynamics.labels.push(this.months[i].getMonYY());
        }
        this.budgetMonths.datasets = [];
        this.toolsBudgetDynamics.datasets = [];
        this.trafficMonths.datasets = [];
        this.toolsTrafficDynamics.datasets = [];

        this.budgetDoughnut = {
            labels: [],
            datasets: [{
                data:[],
                backgroundColor:[],
                borderColor:[]
            }]
        };

        this.trafficDoughnut = {
            labels: [],
            datasets: [{
                data:[],
                backgroundColor:[],
                borderColor:[]
            }]
        };


        Colors.resetColor();
        this.toolsBudgetBySites.datasets = [];
        this.toolsTrafficBySites.datasets = [];
        var toolsBudgetDynamics = {};
        var toolsTrafficDynamics = {};
        var toolsTotal = [];
        for (var is = 0; is < this.sites.length; is++) {
            var s = this.sites[is];
            if (! s.data.months){
                continue;
            }
            var toolsObj = {};
            var budgetMonthsDS = {
                label: s.data.site,
                type: 'line',
                data: [],
                backgroundColor: Colors.opaque(),
                borderColor: Colors.border(),
                borderWidth: Opt.borderWidth
            };

            var trafficMonthsDS = {
                label: s.data.site,
                type: 'line',
                data: [],
                backgroundColor: Colors.opaque(),
                borderColor: Colors.border(),
                borderWidth: Opt.borderWidth
            };

            start = start | 0;
            end = end ? end : (this.months.length - 1);
            var numNulls = monthCompare(s.data.months[0].month, this.months[start]);
            for (var j = 0; j  < numNulls; j++) {
                budgetMonthsDS.data.push(0);
                trafficMonthsDS.data.push(0);
            }
            s.mbTotal = 0;
            s.dbTotal = 0;
            s.mvTotal = 0;
            s.dvTotal = 0;

            for (var im = 0; im < s.data.months.length; im++) {
                var m = s.data.months[im];
                if (monthCompare(m.month, this.months[start]) < 0) {
                    continue;
                }
                if (monthCompare(m.month, this.months[end]) > 0) {
                    break;
                }
                var mb = 0;
                var db = 0;
                var mv = 0;
                var dv = 0;
                for (var j = 0; j < m.data.length; j++) {
                    var kind = m.data[j].kind;

                    if (!toolsObj[kind]) {
                        toolsObj[kind] = {};
                        toolsObj[kind].budgets = {};
                        toolsObj[kind].budgets.mobile = 0;
                        toolsObj[kind].budgets.desktop = 0;
                        toolsObj[kind].traffic = {};
                        toolsObj[kind].traffic.mobile = 0;
                        toolsObj[kind].traffic.desktop = 0;
                        toolsObj[kind].kind = kind;
                    }
                    if (!toolsBudgetDynamics[kind]) {
                        toolsBudgetDynamics[kind] = new Array(end - start + 1);
                        for (var k = 0; k < toolsBudgetDynamics[kind].length; k++) {
                            toolsBudgetDynamics[kind][k] = 0;
                        }
                    }
                    if (!toolsTrafficDynamics[kind]) {
                        toolsTrafficDynamics[kind] = new Array(end - start + 1);
                        for (var k = 0; k < toolsTrafficDynamics[kind].length; k++) {
                            toolsTrafficDynamics[kind][k] = 0;
                        }
                    }
                    var v = parseInt(m.data[j].visits);
                    var b = parseInt(m.data[j].budget);
                    toolsBudgetDynamics[kind][im + numNulls] += b;
                    toolsTrafficDynamics[kind][im + numNulls] += v;
                    if (m.data[j].type == "mobile") {
                        mb += b;
                        mv += v;
                        toolsObj[kind].budgets.mobile += b;
                        toolsObj[kind].traffic.mobile += v;
                    } else if (m.data[j].type == "desktop") {
                        db += b;
                        dv += v;
                        toolsObj[kind].budgets.desktop += b;
                        toolsObj[kind].traffic.desktop += v;
                    }
                };
                budgetMonthsDS.data.push(mb + db);
                trafficMonthsDS.data.push(mv + dv);
                s.mbTotal += mb;
                s.dbTotal += db;
                s.dvTotal += dv;
                s.mvTotal += mv;
            }
            this.budgetMonths.datasets.push(budgetMonthsDS);
            this.trafficMonths.datasets.push(trafficMonthsDS);

            this.budgetDoughnut.datasets[0].data.push(s.mbTotal+s.dbTotal);
            this.budgetDoughnut.datasets[0].backgroundColor.push(Colors.solid());
            this.budgetDoughnut.labels.push(s.title);

            this.trafficDoughnut.datasets[0].data.push(s.mvTotal+s.dvTotal);
            this.trafficDoughnut.datasets[0].backgroundColor.push(Colors.solid());
            this.trafficDoughnut.labels.push(s.title);

            toolsTotal.push({
                site:s.data.site,
                tools:toolsObj
            });

            Colors.next();
        }
        var tools = {};
        for (var it = 0; it < toolsTotal.length; it++) {
            for (var tool in toolsTotal[it].tools) {
                if (tools[tool]) {
                    tools[tool].budgets += toolsTotal[it].tools[tool].budgets.desktop + toolsTotal[it].tools[tool].budgets.mobile;
                    tools[tool].traffic += toolsTotal[it].tools[tool].traffic.desktop + toolsTotal[it].tools[tool].traffic.mobile;
                }
                else {
                    tools[tool] = {
                        budgets: (toolsTotal[it].tools[tool].budgets.desktop + toolsTotal[it].tools[tool].budgets.mobile),
                        traffic: (toolsTotal[it].tools[tool].traffic.desktop + toolsTotal[it].tools[tool].traffic.mobile)
                    }
                }
            }
        }
        var toolsArr = [];
        for (var tool in tools) {
            toolsArr.push({tool: tool, budgets: tools[tool].budgets, traffic: tools[tool].traffic})
        }
        var toolsBudget = toolsArr.filter(function(value, index, arr){
            return value.budgets != 0;
        });
        var toolsTraffic = toolsArr.filter(function(value, index, arr){
            return (value.traffic != 0) && (value.tool != "Unestimated");
        });

        toolsBudget.sort(function (a, b){
            return (a.budgets) > (b.budgets) ? -1 : 1;
        })

        toolsTraffic.sort(function (a, b){
            return (a.traffic) > (b.traffic) ? -1 : 1;
        })
        Colors.resetColor();
        this.toolsBudgetBySites.labels.length = 0;
        for (var it = 0; it < toolsBudget.length; it++) {
            this.toolsBudgetBySites.labels.push(toolsBudget[it].tool);
        }
        for (var is = 0; is < toolsTotal.length; is++) {
            var toolsBudgetBySitesDS = {
                label: toolsTotal[is].site,
                type: 'horizontalBar',
                data: [],
                backgroundColor: Colors.solid(),
                borderWidth: Opt.borderWidth
            };
            for (var it = 0; it < toolsBudget.length; it++) {
                toolsBudgetBySitesDS.data.push(toolsTotal[is].tools[toolsBudget[it].tool].budgets.desktop + toolsTotal[is].tools[toolsBudget[it].tool].budgets.mobile);
            }
            this.toolsBudgetBySites.datasets.push(toolsBudgetBySitesDS);
            Colors.next();
        }

        Colors.resetColor();
        this.toolsTrafficBySites.labels.length = 0;
        for (var it = 0; it < toolsTraffic.length; it++) {
            this.toolsTrafficBySites.labels.push(toolsTraffic[it].tool);
        }
        for (var is = 0; is < toolsTotal.length; is++) {
            var toolsTrafficBySitesDS = {
                label: toolsTotal[is].site,
                type: 'horizontalBar',
                data: [],
                backgroundColor: Colors.solid(),
                borderWidth: Opt.borderWidth
            };
            for (var it = 0; it < toolsTraffic.length; it++) {
                toolsTrafficBySitesDS.data.push(toolsTotal[is].tools[toolsTraffic[it].tool].traffic.desktop + toolsTotal[is].tools[toolsTraffic[it].tool].traffic.mobile);
            }
            this.toolsTrafficBySites.datasets.push(toolsTrafficBySitesDS);
            Colors.next();
        }

        Colors.resetColor();
        for (var it = 0; it < toolsBudget.length; it++) {
            this.toolsBudgetDynamics.datasets.push({
                label: toolsBudget[it].tool,
                type: 'bar',
                data: toolsBudgetDynamics[toolsBudget[it].tool],
                backgroundColor: Colors.solid(),
                borderWidth: Opt.borderWidth
            });
            Colors.next();
        }
        Colors.resetColor();
        for (var it = 0; it < toolsTraffic.length; it++) {
            this.toolsTrafficDynamics.datasets.push({
                label: toolsTraffic[it].tool,
                type: 'bar',
                data: toolsTrafficDynamics[toolsTraffic[it].tool],
                backgroundColor: Colors.solid(),
                borderWidth: Opt.borderWidth
            });
            Colors.next();
        }
    }
}

/* VISUALIZATION */

var Colors = {
    setTitle: '',
    colorIndex: 0,
    bgOpaque: [],
    bgSolid: [],
    bgBorder: [],
    patterns: [
        'zigzag',
        'dot',
        'diagonal',
        'line',
        'diagonal-right-left',
        'line-vertical',
        'zigzag-vertical',
        'disc',
        'diamond',
        'square',
        'triangle',
        'plus',
        'ring',
        'triangle-inverted'
    ],
    patternSets: {
        'PatternGrey': 1,
        'PatternRed': 1,
        'PatternGreen': 1,
        'PatternBlue': 1,
        'PatternRainbow': 1
    },
    mapping: {},
    sets: {
        'Sunset': ['#f3e79b', '#fac484', '#f8a07e', '#eb7f86', '#ce6693', '#a059a0', '#5c53a5', '#fcde9c', '#faa476', '#f0746e', '#e34f6f', '#dc3977', '#b9257a', '#7c1d6f'],
        'Pastel': ['#66C5CC', '#F6CF71', '#F89C74', '#DCB0F2', '#87C55F', '#9EB9F3', '#FE88B1', '#C9DB74', '#8BE0A4', '#B497E7', '#D3B484', '#B3B3B3'],
        'Prism': ['#5F4690', '#1D6996', '#38A6A5', '#0F8554', '#73AF48', '#EDAD08', '#E17C05', '#CC503E', '#94346E', '#6F4070', '#994E95', '#636363'],
        'Antique': ['#855C75', '#D9AF6B', '#AF6458', '#736F4C', '#526A83', '#625377', '#68855C', '#9C9C5E', '#A06177', '#8C785D', '#467378', '#7C7C7C'],
        'Rose': ['#798234', '#a3ad62', '#d0d3a2', '#fdfbe4', '#f0c6c3', '#df91a3', '#d46780', '#008080', '#70a494', '#b4c8a8', '#f6edbd', '#edbb8a', '#de8a5a', '#ca562c'],
        'Bold': ['#7F3C8D', '#11A579', '#3969AC', '#F2B701', '#E73F74', '#80BA5A', '#E68310', '#008695', '#CF1C90', '#f97b72', '#4b4b8f', '#A5AA99'],
        'Safe': ['#88CCEE', '#CC6677', '#DDCC77', '#117733', '#332288', '#AA4499', '#44AA99', '#999933', '#882255', '#661100', '#6699CC', '#888888'],
        'Vivid': ['#E58606', '#5D69B1', '#52BCA3', '#99C945', '#CC61B0', '#24796C', '#DAA51B', '#2F8AC4', '#764E9F', '#ED645A', '#CC3A8E', '#A5AA99'],
        'Rainbow': ['#ff0000', '#55dd00', '#dddd00', '#00ff00', '#8888ff', '#0000ff', '#bb00bb',
                    '#ff0000', '#55dd00', '#dddd00', '#00ff00', '#8888ff', '#0000ff', '#bb00bb']
/*        ,
        'PatternGrey': ['#404040', '#484848', '#505050', '#585858', '#606060', '#686868', '#707070', '#787878', '#808080', '#888888', '#909090', '#989898', '#a0a0a0', '#a8a8a8', '#b0b0b0', '#b8b8b8', '#c0c0c0'],
        'PatternRed': ['#5f0000', '#6f1010', '#7f2020', '#8f3030', '#9f4040', '#af5050', '#bf6060', '#cf7070', '#df8080', '#ef9090', '#ffa0a0', '#ffb0b0', '#ffc0c0'],
        'PatternGreen': ['#005f00', '#106f10', '#207f20', '#308f30', '#409f40', '#50af50', '#60bf60', '#70cf70', '#80df80', '#90ef90', '#a0ffa0', '#b0ffb0', '#c0ffc0'],
        'PatternBlue': ['#00004f', '#10105f', '#20206f', '#30307f', '#40408f', '#50509f', '#6060af', '#7070bf', '#8080cf', '#9090df', '#a0a0ef', '#b0b0ff', '#c0c0ff'],
        'PatternRainbow': ['#ff0000', '#55dd00', '#dddd00', '#00ff00', '#8888ff', '#0000ff', '#bb00bb',
                           '#ff0000', '#55dd00', '#dddd00', '#00ff00', '#8888ff', '#0000ff', '#bb00bb']*/
    },
    initColorsets: function (title) {
        this.setTitle = (title || 'Sunset');
        Colors.bgOpaque.length = 0;
        Colors.bgSolid.length = 0;
        Colors.bgBorder.length = 0;
        for (var i = 0; i < this.sets[this.setTitle].length; i++) {
            var c = this.sets[this.setTitle][i];
            Colors.bgOpaque.push(hexToRgbA(c, 0.2));
            c = hexToRgbA(c, 1.0);
            Colors.bgSolid.push(Colors.patternSets[this.setTitle] ? pattern.draw(Colors.patterns[i % Colors.patterns.length], c) : c);
            Colors.bgBorder.push(c);
        }
    },
    nextColorset: function () {
        var flag = false;
        var oldSetTitle = this.setTitle;
        for (var key in this.sets) {
            if (flag && key != this.setTitle) {
                this.setTitle = key;
                break;
            }
            if (key == this.setTitle) {
                flag = true;
            }
        }
        // Cookie.set("color", this.setTitle);
        if (this.setTitle != oldSetTitle) {
            this.initColorsets(this.setTitle);
            return;
        } else {
            this.initColorsets();
        }
    },
    addMapping: function (key) {
        if (!this.mapping[key]) {
            this.mapping[key] = Object.keys(this.mapping).length;
        }
    },
    solidMapped: function (key) {
        return this.mapping[key] ? this.bgSolid[this.mapping[key]] : this.bgSolid[Object.keys(this.mapping).length];
    },
    opaqueMapped: function (key) {
        return this.mapping[key] ? this.bgOpaque[this.mapping[key]] : this.bgOpaque[Object.keys(this.mapping).length];
    },
    clearMapping: function () {
        for (var key in this.mapping) {
            delete this.mapping[key];
        }
    },
    resetColor: function(){
        this.colorIndex = 0;
    },
    next: function() {
        this.colorIndex = (this.colorIndex <= this.bgOpaque.length) ? this.colorIndex + 1 : 0;
    },
    opaque: function() {
        return this.bgOpaque[this.colorIndex];
    },
    solid: function() {
        return this.bgSolid[this.colorIndex];
    },
    border: function() {
        return this.bgBorder[this.colorIndex];
    }

}

var Opt = {

    borderWidth: 2,

    budgetMonths: {
        tooltips: {
            mode: 'index'
        },
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                        callback: function (value, index, values) {
                            return value.format(0, 3, ' ', '');
                        }
                    }
                }
            ]
        },
        title: {
            display: true,
            position: 'top',
            fontStyle: 'normal',
            fontSize: '16',
            text: STR.HEADER_BUDGET_MONTHS
        }
    },

    budgetDoughnut: {
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    var label = data.labels[tooltipItem.index] + ": " + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].format(0, 3, ' ', '');
                    return label;
                }
            }
        },
        legend: {
            position: 'right'
        },
        title: {
            display: true,
            position: 'top',
            fontStyle: 'normal',
            fontSize: '16',
            text: STR.HEADER_TOTAL_BUDGET
        }
    },

    toolsBudgetBySites: {
        categoryPercentage: 0.8,
        scales: {
            yAxes: [{
                stacked: true
            }],
            xAxes: [
                {
                    stacked: true,
                    ticks: {
                        beginAtZero: true,
                        callback: function (value, index, values) {
                            return value.format(0, 3, ' ', '');
                        }
                    }
                }
            ]
        },
        title: {
            display: true,
            position: 'top',
            fontStyle: 'normal',
            fontSize: '16',
            text: STR.HEADER_TOOLS_BUDGET_SPLIT
        },
        plugins: {
            stacked100: {
                enable: false
            }
        }
    },

    toolsBudgetDynamics: {
        tooltips: {
            mode: 'index'
        },
        scales: {
            xAxes: [{
                stacked: true
      }],
            yAxes: [
                {
                    stacked: true,
                    ticks: {
                        beginAtZero: true,
                        callback: function (value, index, values) {
                            return value.format(0, 3, ' ', '');
                        }
                    }
                }
            ]
        },
        title: {
            display: true,
            position: 'top',
            fontStyle: 'normal',
            fontSize: '16',
            text: STR.HEADER_TOOLS_BUDGET_DYNAMICS
        },
        plugins: {
            stacked100: {
                enable: false
            }
        }

    },

    trafficMonths: {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                        callback: function (value, index, values) {
                            return value.format(0, 3, ' ', '');
                        }
                    }
                }
            ]
        },
        title: {
            display: true,
            position: 'top',
            fontStyle: 'normal',
            fontSize: '16',
            text: STR.HEADER_TRAFFIC_MONTHS
        }
    },

    trafficDoughnut: {
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    var label = data.labels[tooltipItem.index] + ": " + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].format(0, 3, ' ', '');
                    return label;
                }
            }
        },
        legend: {
            position: 'right'
        },
        title: {
            display: true,
            position: 'top',
            fontStyle: 'normal',
            fontSize: '16',
            text: STR.HEADER_TOTAL_TRAFFIC
        }
    },

    toolsTrafficBySites: {
        scales: {
            yAxes: [{
                stacked: true
            }],
            xAxes: [
                {
                    stacked: true,
                    ticks: {
                        beginAtZero: true,
                        callback: function (value, index, values) {
                            return value.format(0, 3, ' ', '');
                        }
                    }
                }
            ]
        },
        title: {
            display: true,
            position: 'top',
            fontStyle: 'normal',
            fontSize: '16',
            text: STR.HEADER_TOOLS_TRAFFIC_SPLIT
        },
        plugins: {
            stacked100: {
                enable: false
            }
        }

    },

    toolsTrafficDynamics: {
        tooltips: {
            mode: 'index'
        },
        scales: {
            xAxes: [{
                stacked: true
        }],
            yAxes: [
                {
                    stacked: true,
                    ticks: {
                        beginAtZero: true,
                        callback: function (value, index, values) {
                            return value.format(0, 3, ' ', '');
                        }
                    }
                }
            ]
        },
        title: {
            display: true,
            position: 'top',
            fontStyle: 'normal',
            fontSize: '16',
            text: STR.HEADER_TOOLS_TRAFFIC_DYNAMICS
        },
        plugins: {
            stacked100: {
                enable: false
            }
        }
    }
}

String.prototype.getMon = function () {
    var m = this.split('-');
    if (m.length == 2) {
        var index = parseInt(m[0]) - 1;
        return STR.MONTHS[index];
    }
    return "";
}

String.prototype.getYY = function () {
    var m = this.split('-');
    if (m.length == 2) {
        var yy = m[1];
        if (yy.length == 4) {
            return yy.substring(2);
        }
    }
    return "";
}

String.prototype.getYYYY = function () {
    var m = this.split('-');
    if (m.length == 2) {
        return m[1];
    }
    return "";
}

String.prototype.getMonYY = function () {
    var m = this.split('-');
    if (m.length == 2) {
        var index = parseInt(m[0]) - 1;
        var yy = m[1];
        if (yy.length == 4) {
            return STR.MONTHS[index] + ' ' + yy.substring(2);
        }
    }
    return "";
}

/* TOOLS*/
Number.prototype.format = function (n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

function hexToRgbA(hex, opacity) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
    }
    throw new Error('Bad Hex');
}

var Cookie = {
    get: function (c_name) {
        var c_start = document.cookie.indexOf(c_name + "=");

        if (document.cookie.length > 0) {
            if (c_start !== -1) {
                return getCookieSubstring(c_start, c_name);
            }
        }
        return "";
    },
    set: function (c_name, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) +
            ((expiredays === null) ? "" : ";expires=" + exdate.toUTCString());
    }
}

function monthCompare(d1, d2) {
    var dd1 = d1.split("-");
    var dd2 = d2.split("-");
    var m1 = parseInt(dd1[0]);
    var y1 = parseInt(dd1[1]);
    var m2 = parseInt(dd2[0]);
    var y2 = parseInt(dd2[1]);
    var yDiff = y1 - y2;
    var mDiff = m1 - m2;
    //console.log (d1 + " " + d2 + ": " + (yDiff * 12 + mDiff));
    return (yDiff * 12 + mDiff)
}
