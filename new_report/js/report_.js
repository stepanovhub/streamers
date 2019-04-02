var STR = {
    LABEL_TOTAL_BUDGET: "Суммарные затраты",
    LABEL_DESKTOP: "Десктоп",
    LABEL_MOBILE: "Мобайл",
    HEADER_BUDGET: "Затраты",
    HEADER_TRAFFIC: "Трафик",
    HEADER_TOOLS_BUDGET_SPLIT: "Затраты по инструментам",
    HEADER_TOOLS_BUDGET_DYNAMICS: "Динамика затрат по инструментам",
    HEADER_BUDGET_AND_TRAFFIC: "Бюджет и трафик",
    LABEL_TOTAL_TRAFFIC: "Суммарный трафик",
    HEADER_TOOLS_TRAFFIC_SPLIT: "Трафик по инструментам",
    HEADER_TOOLS_TRAFFIC_DYNAMICS: "Динамика трафика по инструментам",
    TITLE_COLORSET: "Цветовая схема: ",
    MONTHS: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    MONTHS: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
    ERROR_NO_DATA: "Нет данных"
}

var Datepicker = {
    id: null,
    start: null,
    end: null,
    selected: null,
    init: function (id, array, start, end) {
        if (!array || (!array.length > 0)) {
            return;
        }
        this.id = id;
        this.start = 0;
        this.end = array.length - 1;
        for (var i = 0; i < array.length; i++) {
            var html = '<div data-index="' + i + '">';
            html += '<span class="month">' + array[i].month.getMon() + '</span> <span class="year">' + array[i].month.getYY();
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
                    reset();
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
    budgetDesktopMobile: {},
    toolsBudgetDoughnut: {},
    budgetDynamics: {},
    budgetAndTraffic: {},
    trafficDesktopMobile: {},
    toolsTrafficDoughnut: {},
    trafficDynamics: {}
}

function setData() {
    if (!data || !data.months || !(data.months.length > 0)) {
        $("#span-title").text(STR.ERROR_NO_DATA);
        return;
    }
    Colors.init();
    Chart.defaults.global.defaultFontColor = "#444";
    Chart.defaults.global.defaultFontFamily = 'Roboto';

    $("#p-colorset").text(STR.TITLE_COLORSET);
    $("#span-colorset").text(Colors.setTitle);
    $("#span-colorset").click(function () {
        Colors.next();
        $("#span-colorset").text(Colors.setTitle);
        reset();
    });
    Ds.fill(data);

    $("#span-title").text(data.site + " (" + data.months[0].month.getMonYY() + " — " + data.months[data.months.length - 1].month.getMonYY() + ")");
    $("#span-export").html("<a href='http://digitalbudget.ru/ru" + data.export_url + "' target='_blank' style='color:#888'><i class='fa fa-download'></i> получить выгрузку</a>");

    $("#span-budget-total").text(Ds.budgets.total.format(0, 3, ' ', ''));
    $("#span-budget-desktop").text(Ds.budgets.desktop.format(0, 3, ' ', ''));
    $("#span-budget-mobile").text(Ds.budgets.mobile.format(0, 3, ' ', ''));

    $("#span-budget-total").parent().parent().parent().css("background-color", Colors.bgOpaque[0]);
    $("#span-budget-desktop").parent().parent().parent().css("background-color", Colors.bgOpaque[1]);
    $("#span-budget-mobile").parent().parent().parent().css("background-color", Colors.bgOpaque[2]);

    var ctx = $("#main-top")[0].getContext('2d');
    charts.budgetDesktopMobile = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Ds.budgetDesktopMobile.labels,
            datasets: Ds.budgetDesktopMobile.datasets
        },
        options: Opt.budgetDesktopMobile
    });

    fillToolsTables();

    ctx = $("#tools-budget-doughnut")[0].getContext('2d');
    charts.toolsBudgetDoughnut = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Ds.toolsBudgetDoughnut.labels,
            datasets: Ds.toolsBudgetDoughnut.datasets
        },
        options: Opt.toolsBudgetDoughnut
    });

    ctx = $("#budget-dynamics")[0].getContext('2d');
    charts.budgetDynamics = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Ds.budgetDynamics.labels,
            datasets: Ds.budgetDynamics.datasets
        },
        options: Opt.budgetDynamics
    });

    ctx = $("#budget-and-traffic")[0].getContext('2d');
    charts.budgetAndTraffic = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Ds.budgetAndTraffic.labels,
            datasets: Ds.budgetAndTraffic.datasets
        },
        options: Opt.budgetAndTraffic
    });

    $("#span-traffic-total").text(Ds.traffic.total.format(0, 3, ' ', ''));
    $("#span-traffic-desktop").text(Ds.traffic.desktop.format(0, 3, ' ', ''));
    $("#span-traffic-mobile").text(Ds.traffic.mobile.format(0, 3, ' ', ''));

    $("#span-traffic-total").parent().parent().parent().css("background-color", Colors.bgOpaque[0]);
    $("#span-traffic-desktop").parent().parent().parent().css("background-color", Colors.bgOpaque[1]);
    $("#span-traffic-mobile").parent().parent().parent().css("background-color", Colors.bgOpaque[2]);

    ctx = $("#chart-traffic-desktop-mobile")[0].getContext('2d');
    charts.trafficDesktopMobile = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Ds.trafficDesktopMobile.labels,
            datasets: Ds.trafficDesktopMobile.datasets
        },
        options: Opt.trafficDesktopMobile
    });

    ctx = $("#tools-traffic-doughnut")[0].getContext('2d');
    charts.toolsTrafficDoughnut = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Ds.toolsTrafficDoughnut.labels,
            datasets: Ds.toolsTrafficDoughnut.datasets
        },
        options: Opt.toolsTrafficDoughnut
    });

    ctx = $("#traffic-dynamics")[0].getContext('2d');
    charts.trafficDynamics = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Ds.trafficDynamics.labels,
            datasets: Ds.trafficDynamics.datasets
        },
        options: Opt.trafficDynamics
    });

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

function fillSourcesTable(kind) {
    $("#table-sources").empty();
    Ds.toolsBudget.forEach(function (tool) {
        if (tool.kind == kind) {
            var budgetDesktop = tool.budgets.desktop;
            var budgetMobile = tool.budgets.mobile;
            var str = '<tr>';
            str += '<th scope="row">' + tool.kind + '</th>';
            str += '<td>' + (budgetDesktop + budgetMobile).format(0, 3, ' ', '') + '</td>';
            str += '<td>' + budgetDesktop.format(0, 3, ' ', '') + '</td>';
            str += '<td>' + budgetMobile.format(0, 3, ' ', '') + '</td>';
            str += '</tr>';
            $("#table-sources").append(str);
        }
    })
}

function reset() {
    Ds.fill(data, Datepicker.start, Datepicker.end);

    $("#span-title").text(data.site + " (" + data.months[Datepicker.start].month.getMonYY() + " — " + data.months[Datepicker.end].month.getMonYY() + ")");

    $("#span-budget-total").text(Ds.budgets.total.format(0, 3, ' ', ''));
    $("#span-budget-desktop").text(Ds.budgets.desktop.format(0, 3, ' ', ''));
    $("#span-budget-mobile").text(Ds.budgets.mobile.format(0, 3, ' ', ''));

    $("#span-budget-total").parent().parent().parent().css("background-color", Colors.bgOpaque[0]);
    $("#span-budget-desktop").parent().parent().parent().css("background-color", Colors.bgOpaque[1]);
    $("#span-budget-mobile").parent().parent().parent().css("background-color", Colors.bgOpaque[2]);

    charts.budgetDesktopMobile.data.labels = Ds.budgetDesktopMobile.labels;
    Ds.budgetDesktopMobile.datasets.forEach(function (v, i) {
        charts.budgetDesktopMobile.data.datasets[i].data = v.data;
        charts.budgetDesktopMobile.data.datasets[i].backgroundColor = v.backgroundColor;
        charts.budgetDesktopMobile.data.datasets[i].borderColor = v.borderColor;
    })
    charts.budgetDesktopMobile.update();

    fillToolsTables();

    charts.toolsBudgetDoughnut.data.labels = Ds.toolsBudgetDoughnut.labels;
    Ds.toolsBudgetDoughnut.datasets.forEach(function (v, i) {
        charts.toolsBudgetDoughnut.data.datasets[i].data = v.data;
        charts.toolsBudgetDoughnut.data.datasets[i].backgroundColor = v.backgroundColor;
        charts.toolsBudgetDoughnut.data.datasets[i].borderColor = v.borderColor;
    })
    charts.toolsBudgetDoughnut.update();

    charts.budgetDynamics.data.labels = Ds.budgetDynamics.labels;
    Ds.budgetDynamics.datasets.forEach(function (v, i) {
        charts.budgetDynamics.data.datasets[i].data = v.data;
        charts.budgetDynamics.data.datasets[i].backgroundColor = v.backgroundColor;
        charts.budgetDynamics.data.datasets[i].borderColor = v.borderColor;
    })
    charts.budgetDynamics.update();

    charts.budgetAndTraffic.data.labels = Ds.budgetAndTraffic.labels;
    Ds.budgetAndTraffic.datasets.forEach(function (v, i) {
        charts.budgetAndTraffic.data.datasets[i].data = v.data;
        charts.budgetAndTraffic.data.datasets[i].backgroundColor = v.backgroundColor;
        charts.budgetAndTraffic.data.datasets[i].borderColor = v.borderColor;
    })
    charts.budgetAndTraffic.update();

    $("#span-traffic-total").text(Ds.traffic.total.format(0, 3, ' ', ''));
    $("#span-traffic-desktop").text(Ds.traffic.desktop.format(0, 3, ' ', ''));
    $("#span-traffic-mobile").text(Ds.traffic.mobile.format(0, 3, ' ', ''));

    $("#span-traffic-total").parent().parent().parent().css("background-color", Colors.bgOpaque[0]);
    $("#span-traffic-desktop").parent().parent().parent().css("background-color", Colors.bgOpaque[1]);
    $("#span-traffic-mobile").parent().parent().parent().css("background-color", Colors.bgOpaque[2]);

    charts.trafficDesktopMobile.data.labels = Ds.trafficDesktopMobile.labels;
    Ds.trafficDesktopMobile.datasets.forEach(function (v, i) {
        charts.trafficDesktopMobile.data.datasets[i].data = v.data;
        charts.trafficDesktopMobile.data.datasets[i].backgroundColor = v.backgroundColor;
        charts.trafficDesktopMobile.data.datasets[i].borderColor = v.borderColor;
    })
    charts.trafficDesktopMobile.update();

    charts.toolsTrafficDoughnut.data.labels = Ds.toolsTrafficDoughnut.labels;
    Ds.toolsTrafficDoughnut.datasets.forEach(function (v, i) {
        charts.toolsTrafficDoughnut.data.datasets[i].data = v.data;
        charts.toolsTrafficDoughnut.data.datasets[i].backgroundColor = v.backgroundColor;
        charts.toolsTrafficDoughnut.data.datasets[i].borderColor = v.borderColor;
    })
    charts.toolsTrafficDoughnut.update();

    charts.trafficDynamics.data.labels = Ds.trafficDynamics.labels;
    Ds.trafficDynamics.datasets.forEach(function (v, i) {
        charts.trafficDynamics.data.datasets[i].data = v.data;
        charts.trafficDynamics.data.datasets[i].backgroundColor = v.backgroundColor;
        charts.trafficDynamics.data.datasets[i].borderColor = v.borderColor;
    })
    charts.trafficDynamics.update();


}

var Ds = {
    budgetDesktopMobile: {},
    budgets: {
        total: 0,
        desktop: 0,
        mobile: 0
    },
    toolsBudget: [],
    toolsTraffic: [],
    traffic: {
        total: 0,
        desktop: 0,
        mobile: 0
    },
    toolsBudgetDoughnut: {},
    toolsTrafficDoughnut: {},
    budgetDynamics: {},
    trafficDynamics: {},
    budgetAndTraffic: {},
    trafficDesktopMobile: {},
    fill: function (data, start, end) {
        this.budgetDesktopMobile.labels = [];
        this.budgetDesktopMobile.datasets = [
            {
                label: STR.LABEL_TOTAL_BUDGET,
                data: [],
                backgroundColor: Colors.bgOpaque[0],
                borderColor: Colors.border[0],
                borderWidth: Opt.borderWidth
            },
            {
                label: STR.LABEL_DESKTOP,
                data: [],
                backgroundColor: Colors.bgOpaque[1],
                borderColor: Colors.border[1],
                borderWidth: Opt.borderWidth
            },
            {
                label: STR.LABEL_MOBILE,
                data: [],
                backgroundColor: Colors.bgOpaque[2],
                borderColor: Colors.border[2],
                borderWidth: Opt.borderWidth
            }
        ];
        this.budgetDynamics.labels = [];
        this.budgetDynamics.datasets = [];
        this.trafficDynamics.labels = [];
        this.trafficDynamics.datasets = [];
        this.budgets.total = 0;
        this.budgets.desktop = 0;
        this.budgets.mobile = 0;
        this.traffic.total = 0;
        this.traffic.desktop = 0;
        this.traffic.mobile = 0;
        this.toolsBudget.length = 0;
        this.toolsTraffic.length = 0;
        var toolsObj = {};
        var toolsBudgetDynamics = {};
        var toolsTrafficDynamics = {};
        this.budgetAndTraffic.labels = [];
        this.budgetAndTraffic.datasets = [
            {
                label: STR.HEADER_BUDGET,
                type: 'line',
                data: [],
                backgroundColor: Colors.bgOpaque[0],
                borderColor: Colors.border[0],
                borderWidth: Opt.borderWidth
            },
            {
                label: STR.HEADER_TRAFFIC,
                data: [],
                backgroundColor: Colors.bgOpaque[1],
                borderColor: Colors.border[1],
                borderWidth: Opt.borderWidth
            }
        ];
        this.trafficDesktopMobile.labels = [];
        this.trafficDesktopMobile.datasets = [
            {
                label: STR.LABEL_TOTAL_TRAFFIC,
                data: [],
                backgroundColor: Colors.bgOpaque[0],
                borderColor: Colors.border[0],
                borderWidth: Opt.borderWidth
            },
            {
                label: STR.LABEL_DESKTOP,
                data: [],
                backgroundColor: Colors.bgOpaque[1],
                borderColor: Colors.border[1],
                borderWidth: Opt.borderWidth
            },
            {
                label: STR.LABEL_MOBILE,
                data: [],
                backgroundColor: Colors.bgOpaque[2],
                borderColor: Colors.border[2],
                borderWidth: Opt.borderWidth
            }

        ];
        start = start || 0;
        end = end || data.months.length - 1;
        for (var i = start; i <= end; i++) {
            var m = data.months[i];
            this.budgetDesktopMobile.labels.push(m.month.getMonYY());
            this.budgetDynamics.labels.push(m.month.getMonYY());
            this.trafficDynamics.labels.push(m.month.getMonYY());
            this.trafficDesktopMobile.labels.push(m.month.getMonYY());
            this.budgetAndTraffic.labels.push(m.month.getMonYY());
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
                toolsBudgetDynamics[kind][i - start] += b;
                toolsTrafficDynamics[kind][i - start] += v;
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
            this.budgetDesktopMobile.datasets[0].data.push(mb + db);
            this.budgetDesktopMobile.datasets[1].data.push(db);
            this.budgetDesktopMobile.datasets[2].data.push(mb);
            this.trafficDesktopMobile.datasets[0].data.push(mv + dv);
            this.trafficDesktopMobile.datasets[1].data.push(dv);
            this.trafficDesktopMobile.datasets[2].data.push(mv);
            this.budgetAndTraffic.datasets[1].data.push(mv + dv);
            this.budgets.total += mb + db;
            this.budgets.desktop += db;
            this.budgets.mobile += mb;
            this.traffic.total += mv + dv;
            this.traffic.desktop += dv;
            this.traffic.mobile += mv;
        }
        this.toolsBudgetDoughnut.datasets = [
            {
                label: STR.LABEL_TOTAL_BUDGET,
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 0
            }
        ];
        this.toolsBudgetDoughnut.labels = [];
        for (var key in toolsBudgetDynamics) {
            Colors.addMapping(key);
        }
        for (var key in toolsObj) {
            this.toolsBudget.push(toolsObj[key]);
        }
        this.toolsBudget.sort(function (a, b) {
            return (a.budgets.desktop + a.budgets.mobile) > (b.budgets.desktop + b.budgets.mobile) ? -1 : 1;
        })
        this.toolsBudget.forEach(function (obj, i) {
            if (obj.budgets.desktop + obj.budgets.mobile > 0) {
                Ds.toolsBudgetDoughnut.labels.push(obj.kind);
                Ds.toolsBudgetDoughnut.datasets[0].data.push(obj.budgets.desktop + obj.budgets.mobile);
                Ds.toolsBudgetDoughnut.datasets[0].backgroundColor.push(Colors.solidMapped(obj.kind));
                Ds.toolsBudgetDoughnut.datasets[0].borderColor.push(Colors.solidMapped(obj.kind));
            }
        })
        for (var key in toolsBudgetDynamics) {
            this.budgetDynamics.datasets.push({
                label: key,
                data: toolsBudgetDynamics[key],
                backgroundColor: Colors.solidMapped(key)
            });
        }

        this.toolsTrafficDoughnut.datasets = [
            {
                label: STR.LABEL_TOTAL_TRAFFIC,
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 0
            }
        ];
        this.toolsTrafficDoughnut.labels = [];
        for (var key in toolsObj) {
            this.toolsTraffic.push(toolsObj[key]);
        }
        this.toolsTraffic.sort(function (a, b) {
            return (a.traffic.desktop + a.traffic.mobile) > (b.traffic.desktop + b.traffic.mobile) ? -1 : 1;
        })
        this.toolsTraffic.forEach(function (obj, i) {
            if (obj.traffic.desktop + obj.traffic.mobile > 0) {
                Ds.toolsTrafficDoughnut.labels.push(obj.kind);
                Ds.toolsTrafficDoughnut.datasets[0].data.push(obj.traffic.desktop + obj.traffic.mobile);
                Ds.toolsTrafficDoughnut.datasets[0].backgroundColor.push(Colors.solidMapped(obj.kind));
                Ds.toolsTrafficDoughnut.datasets[0].borderColor.push(Colors.solidMapped(obj.kind));
            }
        })
        for (var key in toolsTrafficDynamics) {
            this.trafficDynamics.datasets.push({
                label: key,
                data: toolsTrafficDynamics[key],
                backgroundColor: Colors.solidMapped(key)
            });
        }

        this.budgetAndTraffic.datasets[0].data = this.budgetDesktopMobile.datasets[0].data;
        this.budgetAndTraffic.datasets[0].yAxisID = 'y-budget';
        this.budgetAndTraffic.datasets[1].yAxisID = 'y-traffic';

    }
}

/* VISUALIZATION */

var Colors = {
    setTitle: '',
    bgOpaque: [],
    bgSolid: [],
    border: [],
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
                    '#ff0000', '#55dd00', '#dddd00', '#00ff00', '#8888ff', '#0000ff', '#bb00bb'],
        'PatternGrey': ['#404040', '#484848', '#505050', '#585858', '#606060', '#686868', '#707070', '#787878', '#808080', '#888888', '#909090', '#989898', '#a0a0a0', '#a8a8a8', '#b0b0b0', '#b8b8b8', '#c0c0c0'],
        'PatternRed': ['#5f0000', '#6f1010', '#7f2020', '#8f3030', '#9f4040', '#af5050', '#bf6060', '#cf7070', '#df8080', '#ef9090', '#ffa0a0', '#ffb0b0', '#ffc0c0'],
        'PatternGreen': ['#005f00', '#106f10', '#207f20', '#308f30', '#409f40', '#50af50', '#60bf60', '#70cf70', '#80df80', '#90ef90', '#a0ffa0', '#b0ffb0', '#c0ffc0'],
        'PatternBlue': ['#00004f', '#10105f', '#20206f', '#30307f', '#40408f', '#50509f', '#6060af', '#7070bf', '#8080cf', '#9090df', '#a0a0ef', '#b0b0ff', '#c0c0ff'],
        'PatternRainbow': ['#ff0000', '#55dd00', '#dddd00', '#00ff00', '#8888ff', '#0000ff', '#bb00bb',
                           '#ff0000', '#55dd00', '#dddd00', '#00ff00', '#8888ff', '#0000ff', '#bb00bb']
    },
    init: function (title) {
        this.setTitle = (title || Cookie.get('color') || 'Sunset');
        Colors.bgOpaque.length = 0;
        Colors.bgSolid.length = 0;
        Colors.border.length = 0;
        for (var i = 0; i < this.sets[this.setTitle].length; i++) {
            var c = this.sets[this.setTitle][i];
            Colors.bgOpaque.push(hexToRgbA(c, 0.2));
            c = hexToRgbA(c, 1.0);
            Colors.bgSolid.push(Colors.patternSets[this.setTitle] ? pattern.draw(Colors.patterns[i % Colors.patterns.length], c) : c);
            Colors.border.push(c);
        }
    },
    next: function () {
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
        Cookie.set("color", this.setTitle);
        if (this.setTitle != oldSetTitle) {
            this.init(this.setTitle);
            return;
        } else {
            this.init();
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
    }

}

var Opt = {
    borderWidth: 2,
    budgetDesktopMobile: {
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
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    var label = tooltipItem.yLabel;
                    return label.format(0, 3, ' ', '');
                }
            }
        },
        title: {
            display: true,
            position: 'top',
            fontStyle: 'normal',
            fontSize: '16',
            text: STR.HEADER_BUDGET
        }
    },

    toolsBudgetDoughnut: {
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
            text: STR.HEADER_TOOLS_BUDGET_SPLIT
        }
    },

    budgetDynamics: {
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
        }
    },

    budgetAndTraffic: {
        scales: {
            yAxes: [
                {
                    id: 'y-budget',
                    type: 'linear',
                    ticks: {
                        beginAtZero: true,
                        callback: function (value, index, values) {
                            return value.format(0, 3, ' ', '');
                        }
                    }
                },
                {
                    id: 'y-traffic',
                    type: 'linear',
                    position: 'right',
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
            text: STR.HEADER_BUDGET_AND_TRAFFIC
        }
    },

    trafficDesktopMobile: {
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
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    var label = tooltipItem.yLabel;
                    return label.format(0, 3, ' ', '');
                }
            }
        },
        title: {
            display: true,
            position: 'top',
            fontStyle: 'normal',
            fontSize: '16',
            text: STR.HEADER_TRAFFIC
        }
    },

    toolsTrafficDoughnut: {
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
            text: STR.HEADER_TOOLS_TRAFFIC_SPLIT
        }
    },

    trafficDynamics: {
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
