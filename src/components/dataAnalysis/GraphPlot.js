import React, {Component} from 'react';
import {withStyles, Typography, Divider} from '@material-ui/core';
import {Line, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, Brush, ComposedChart,
    Bar, PieChart, Pie, Cell, Sector, Area, ReferenceLine} from 'recharts';
import EnhancedTable from '../grid/Grid';
import {METRIC_TYPE, DATA_VIEW_TYPE, SORTING} from '../../constants/Constant';
import DataProcessingComponent from './DataProcessComponent';
import AlertAnalysis from './AlertAnalysis';
import styles from './DataAnalysisStyle';

class GraphPlot extends Component {
    state = ({
        activeIndex: 0,
        selectedLine: null,
        opacity: {
            did1:1,
            did2:1,
            did3:1,
            did4:1
        },
        order: SORTING['DECENDING'],
        orderBy: 'name',
        selected: [],
        page: 0,
        rowsPerPage: 5
    });

    onPieEnter = (data, index) => {
    /**
     * For pie chart, on mouse hover this function is called.
     */
        this.setState({
            activeIndex: index,
        });
    }

    handleLegendMouseEnter = (o) =>{
        const { dataKey } = o;
        const { opacity } = this.state;
        Object.keys(opacity).map(key => {
            opacity[key] = 0.2
        })
        this.setState({
            opacity: { ...opacity, [dataKey]: 1 },
        });
    }
      
    handleLegendMouseLeave = (o) =>{
        const { opacity } = this.state;
        Object.keys(opacity).map(key => {
            opacity[key] = 1
        })
        this.setState({
            opacity: { ...opacity,
                // [dataKey]: 1
            },
        });
    }

    selectLine = (event) => {
        let selectedLine = this.state.selectedLine === event.dataKey ? null : event.dataKey.trim();
        this.setState({
            selectedLine,
        });
    }
    
    render() {
        const {classes, metrics, graphData, nameMapper,
            stateData, handleSamplingChange, isDashboard,
            handleBarClick, handleClose, isCustomModal,
            referenceMapper} = this.props;
        const renderActiveShape = (props) => {
        /**
         * This function will create an arc on mouse hover for pie chanrt 
         */
            const RADIAN = Math.PI / 180;
            const { cx, cy, midAngle, innerRadius, outerRadius, startAngle,
                endAngle, fill, payload, percent, value } = props;
            const sin = Math.sin(-RADIAN * midAngle);
            const cos = Math.cos(-RADIAN * midAngle);
            const sx = cx + (outerRadius + 10) * cos;
            const sy = cy + (outerRadius + 10) * sin;
            const mx = cx + (outerRadius + 30) * cos;
            const my = cy + (outerRadius + 30) * sin;
            const ex = mx + (cos >= 0 ? 1 : -1) * 22;
            const ey = my;
            const textAnchor = cos >= 0 ? 'start' : 'end';
        
            return (
                <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{value}</text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                    {`(Rate ${(percent * 100).toFixed(2)}%)`}
                </text>
                </g>
            );
        };

        return (
        /**
         * Loop through metrics dimentions, in order to get all the graphs drawn.
         * Check for the type of the graph and as per conditions decide what to show.
         */
            metrics.map((metric, index) => {
                return <div key={index}
                className={isDashboard && metric['metricType'] === "raw_data"? classes.alertBox :
                isDashboard && metric['metricType'] === "categorical" ? classes.dashboardPie : 
                isCustomModal ? classes.customModal : classes.otherData} >
                <Divider className={classes.seperator}/>
                    {/* <DataProcessingComponent stateData={stateData}
                        handleSamplingChange={handleSamplingChange}
                        metrics={metric}/> */}
                    <Typography gutterBottom variant="h6">
                        {metric.metricName}
                    </Typography>
                    {(metric.metricType === METRIC_TYPE['TIMESERIES'] && metric.metricDataKey) &&
                        <ResponsiveContainer width='100%' height={400}>
                            <ComposedChart className={classes.lineChart} data={graphData[metric.metricID]}
                                margin={{top: 5, right: 30, left: 20, bottom: 5}}
                                onClick={e => !isCustomModal? handleBarClick(metric.metricID): ''}>
                                <XAxis dataKey="name" 
                                    minTickGap={20}
                                    // type="number"
                                    label={{ value: 'Time of day', position: 'insideBottomRight', offset: -3}}
                                    />
                                {metric.dimensions[0].type === 'derivedDim' ?
                                    <YAxis type="category" width={120}
                                    />
                                :
                                    <YAxis
                                    // label={{ value: 'Concentration (ppm)', angle: -90, position: 'insideLeft'}}//insideBottomLeft
                                    />
                                }
                                <CartesianGrid strokeDasharray="3 3"/>
                                <Tooltip/>
                                {/* <Tooltip content={<CustomTooltip/>}/> */}
                                <Legend onClick={isCustomModal ? this.selectLine : ''}
                                    onMouseEnter={!isCustomModal ? this.handleLegendMouseEnter: ''}
                                    onMouseLeave={!isCustomModal ? this.handleLegendMouseLeave: ''}
                                    />
                                {/* <Brush dataKey='name' height={30} stroke="#8884d8"/> */}
                                {nameMapper &&
                                    Object.keys(nameMapper[metric.metricID]).map(key => {
                                        let mapper = nameMapper[metric.metricID][key];
                                        if(mapper['chartType'] === DATA_VIEW_TYPE['LINE']) {
                                            return(<Line name={mapper['name']} key={key} type="monotone"
                                                // strokeWidth={2}
                                                // dataKey={key}
                                                dataKey={this.state.selectedLine === null || this.state.selectedLine === key ? key : `${key} `}
                                                dot={false}
                                                activeDot={{onClick: () => !isCustomModal? handleBarClick(metric.metricID): ''}}
                                                isAnimationActive={false}
                                                stroke={mapper['color']}
                                                // onClick={e => !isCustomModal? handleBarClick(metric.metricID): ''}
                                                strokeOpacity={this.state.opacity[key]}
                                                />)
                                        }
                                        if (mapper['chartType'] === DATA_VIEW_TYPE['BAR']) {
                                            return <Bar name={mapper['name']} key={key}
                                                dataKey={this.state.selectedLine === null || this.state.selectedLine === key ? key : `${key} `}
                                                // dataKey={key}
                                                fill={mapper['color']} isAnimationActive={false}
                                                // onClick={e => !isCustomModal? handleBarClick(metric.metricID): ''}
                                                fillOpacity={this.state.opacity[key]}
                                                />
                                        }
                                        if (mapper['chartType'] === DATA_VIEW_TYPE['SCATTER']) {
                                            return <Line name={mapper['name']}
                                                key={key}
                                                dataKey={this.state.selectedLine === null || this.state.selectedLine === key ? key : `${key} `}
                                                // dataKey={key}
                                                // activeDot={{onClick: () => !isCustomModal? handleBarClick(metric.metricID): ''}}
                                                // dot={{stroke: mapper['color'] , onClick: () => !isCustomModal? handleBarClick(metric.metricID): ''}}
                                                fill={mapper['color']}
                                                stroke={mapper['color']}
                                                strokeWidth={0}
                                                legendType="circle"
                                                // stroke="none"
                                                isAnimationActive={false}
                                                fillOpacity={this.state.opacity[key]}
                                                />
                                        }
                                        if (mapper['chartType'] === DATA_VIEW_TYPE['AREA']) {
                                            return <Area type='monotone'
                                                name={mapper['name']}
                                                key={key}
                                                dataKey={key}
                                                fill={mapper['color']}
                                                stroke={mapper['color']}
                                                isAnimationActive={false}
                                                // strokeOpacity={this.state.opacity[key]}
                                                />
                                        }
                                    })
                                }
                                {referenceMapper &&
                                    Object.keys(referenceMapper[metric.metricID]).map(key => {
                                        let referenceLine = referenceMapper[metric.metricID][key]
                                        if(referenceLine)
                                            return (
                                                <ReferenceLine y={referenceLine['trendLineY']}
                                                    stroke={referenceLine['color']}
                                                    strokeOpacity={0.3}
                                                    label={{ position: 'insideTopRight',  value: referenceLine['name'], fill: referenceLine['color'], fontSize: 10 }}/>
                                                )
                                    })
                                }
                            </ComposedChart>
                        </ResponsiveContainer>
                    }
                    {(metric.metricType === METRIC_TYPE['CATEGORICAL']) ?
                        <ResponsiveContainer
                        width='100%' 
                        height={400}>
                            {metric.dimensions[0].ctype === DATA_VIEW_TYPE['PIE'] ?
                                <PieChart>
                                    <Pie
                                        dataKey="value"
                                        activeIndex={this.state.activeIndex}
                                        activeShape={renderActiveShape}
                                        isAnimationActive={true}
                                        data={graphData[metric.metricID]} 
                                        labelLine={false}
                                        outerRadius={isDashboard ? 80 : 120} 
                                        fill="#8884d8"
                                        innerRadius={isDashboard ? 60: 100}
                                        onMouseEnter={this.onPieEnter}>
                                        {
                                            graphData[metric.metricID].map((entry, index) =>
                                                <Cell fill={entry.color} key={index}/>
                                            )
                                        }
                                    </Pie>
                                    <Legend/>
                                </PieChart>
                            : metric.dimensions[0].ctype === DATA_VIEW_TYPE['VERTICAL'] ?
                                <ResponsiveContainer width='100%' height={400}>
                                    <ComposedChart layout="vertical" className={classes.lineChart}
                                        data={graphData[metric.metricID]}
                                        margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                                        <YAxis dataKey="name" minTickGap={20} type="category"
                                            label={{ value: 'Dispenser', angle: -90, position: 'insideLeft'}}/>
                                        <XAxis type="number" 
                                            label={{ value: 'Value', position: 'insideBottomRight', offset: 0}}/>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <Tooltip/>
                                        <Legend />
                                        {nameMapper &&
                                            Object.keys(nameMapper[metric.metricID]).map(key => {
                                                let mapper = nameMapper[metric.metricID][key];
                                                return <Bar name={mapper['name']} barSize={60} key={key}
                                                    dataKey={key} isAnimationActive={false}>
                                                    {
                                                        graphData[metric.metricID].map((entry, index) => {
                                                            let color;
                                                            if(entry[key] >= 80)
                                                                color = '#1b5e20';
                                                            else if(entry[key] <= 40)
                                                                color = '#dd2c00';
                                                            else if(entry[key] < 80 && entry[key] > 40)
                                                                color = '#ffeb3b';
                                                            return <Cell key={index} fill={color}
                                                                // onClick={e => handleBarClick(entry[key])}
                                                            />;
                                                        })
                                                    }
                                                </Bar>
                                            })
                                        }
                                    </ComposedChart>
                                </ResponsiveContainer>
                            : (metric.dimensions[0].ctype === DATA_VIEW_TYPE['TILE'] ?
                                    <div className={classes.tile}
                                        style={{backgroundColor:graphData[metric.metricID][0].color}}>
                                        <Typography gutterBottom variant="h6">
                                            {graphData[metric.metricID][0].name}
                                        </Typography>
                                        <Typography gutterBottom variant="h6">
                                            {graphData[metric.metricID][0].value}
                                        </Typography>
                                    </div>
                                :
                                    <div>Can't find appropriate Pattern!</div>
                                )
                            }
                        </ResponsiveContainer>
                    :
                    (metric.metricType === METRIC_TYPE['RAW_DATA'] &&
                        <AlertAnalysis stateData={graphData[metric.metricID]}
                            isDashboard={isDashboard}/>
                    // :
                    //     <div>Can't find appropriate Pattern</div>
                    )
                    
                    }
                    {(metric.metricType === METRIC_TYPE['TABLE_DATA'])&&
                        <div onClick={e => !isCustomModal? handleBarClick(metric.metricID): ''}>
                            <EnhancedTable data={graphData[metric.metricID]} rows={nameMapper[metric.metricID]}
                            order={this.state.order} orderBy={this.state.orderBy}
                            rowsPerPage={this.state.rowsPerPage} page={this.state.page}
                            selected={this.state.selected}
                            redirectID="v_sessionId"
                            allowDelete={false} allowEdit={false}/>
                        </div>
                    }
                </div>
            })
        )
    }
}

export default withStyles(styles)(GraphPlot);


// const CustomTooltip  = React.createClass({
  
//     getIntroOfPage(label) {
//         let mapper =[];
//     let toolTip = ''
//       mapper.map((dt) => {
//           if(dt['label'] === label && dt['toolTip']) {
//             toolTip =  dt['toolTip']
//         }
//       })
//       return toolTip;
//     },
  
//     render() {
//       const { active } = this.props;
  
//       if (active) {
//         const { payload } = this.props;
//           return (
//             <div className="custom-tooltip">
//              {payload.map((row) =>
//              <div>
//                <p className="label">{`${row.dataKey} : ${row.value}`}</p>
//                <p className="intro">{this.getIntroOfPage(row.dataKey)}</p>
//                </div>
//              )}
//             </div>
//           );
       
//       }
//       return null;
//     }
//   });
