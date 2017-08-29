import React from 'react'
import {Row, Col, FormGroup, ControlLabel, FormControl, Table, OverlayTrigger, Popover} from 'react-bootstrap'
import ResponsiveFixedDataTable from 'responsive-fixed-data-table'
import {Column, Cell} from 'fixed-data-table'

class App extends React.Component {

    static defaultProps = {
        agentPercent: 1.5,
        marketingFee: 0,
        conveyanceSell: 800,
        mortgageA: 215310,
        mortgageB: 141454,
        otherSell: 0,

        buildPrice: 500000,
        demolitionPrice: 0,
        otherBuyCost: 0,
        rates: 2000,
        conveyanceBuy: 800,

        stampDutyBase: 21330,
        stampDutyPer: 100,
        stampDutyRate: 5.50,
        stampDutyThreshold: 500000
    }

    constructor(props) {
        super(props)
        // build practitioners list

        let defaultProps = App.defaultProps
        this.state = {...defaultProps, show: false}
        let emvs = []
        for (let i = 575; i <= 670; i = i + 5) {
            emvs.push(i * 1000)
        }
        this.state.emvs = emvs
        let pp = []
        for (let j = 550; j <= 810; j = j + 10) {
            pp.push(j * 1000)
        }
        this.state.pps = pp
    }

    dollarFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })

    percentFormatter = new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })

    _handleChange = (event) => {
        let id = event.currentTarget.id;
        this._updateField(id, event.currentTarget.value)
    }

    _updateField(id, val) {
        if (!val || val.length == 0) {
            val = App.defaultProps[id]
        }

        console.log(val)

        let newState = {}
        newState[id] = parseFloat(val)
        console.log(newState)
        this.setState(newState)


    }

    agentFee(sellPrice) {
        return sellPrice * (this.state.agentPercent / 100)
    }

    mortgage() {
        return parseInt(this.state.mortgageA) + parseInt(this.state.mortgageB)
    }

    afterSaleCash(sellPrice) {
        return sellPrice - this.state.marketingFee - this.agentFee(sellPrice) - this.mortgage() - this.state.conveyanceSell
    }

    stampDuty(landPrice) {
        let overFiveHundred = landPrice - App.defaultProps.stampDutyThreshold
        let over100Lots = overFiveHundred / App.defaultProps.stampDutyPer
        let sdAmount = Math.ceil(over100Lots) * App.defaultProps.stampDutyRate
        return App.defaultProps.stampDutyBase + sdAmount
    }

    purchaseCost(landPrice) {
        let pc = landPrice
        pc += this.state.buildPrice
        pc += this.state.demolitionPrice
        pc += this.state.rates
        pc += this.state.conveyanceBuy
        pc += this.state.otherBuyCost
        pc += this.stampDuty(landPrice)
        pc += this.lto(landPrice)
        return pc
    }

    loan(sellPrice, landPrice) {
        return this.purchaseCost(landPrice) - this.afterSaleCash(sellPrice);
    }

    lvr(sellPrice, landPrice) {
        return this.loan(sellPrice, landPrice) / this.purchaseCost(landPrice);
    }

    lto(landPrice) {
        let lto = 0;
        let mod = Math.ceil((landPrice - 550000) / 10000);

        let vals = [4299.00, 4379.50, 4460.00, 4540.50, 4621.00, 4701.00, 4782.00, 4862.50, 4943.00, 5023.50, 5104.00, 5184.50, 5265.00, 5345.50, 5426.00, 5506.50, 5587.00, 5667.50, 5748.00, 5828.50, 5909.00, 5989.50, 6070.00, 6150.50, 6231.00, 6311.50, 6392.00]

        return vals[mod];

        switch (mod) {
            case 0:
                lto = 4218.50;
                break;
            case 1:
                lto = 4299.00;
                break;
            case 2:
                lto = 4379.50;
                break;
            case 3:
                lto = 4460.00;
                break;
            case 4:
                lto = 4540.50;
                break;
            case 5:
                lto = 4621.00;
                break;
            case 6:
                lto = 4782.00;
                break;
            case 7:
                lto = 4862.50;
                break;
            case 8:
                lto = 4943.00;
                break;
            case 9:
                lto = 5023.50;
                break;
            case 10:
                lto = 5104.00;
                break;
            case 11:
                lto = 5184.50;
                break;
            case 12:
                lto = 5265.00;
                break;
            case 13:
                lto = 5345.50;
                break;
            case 14:
                lto = 5426.00;
                break;
            case 15:
                lto = 5506.50;
                break;
            case 16:
                lto = 5587.00;
                break;
            case 17:
                lto = 5667.50;
                break;
            case 18:
                lto = 5748.00;
                break;
            case 19:
                lto = 5828.50;
                break;
            case 20:
                lto = 5909.00;
                break;
            case 21:
                lto = 5989.50;
                break;
            case 22:
                lto = 6070.00;
                break;
            case 23:
                lto = 6150.50;
                break;
            case 24:
                lto = 6231.00;
                break;
            case 25:
                lto = 6311.50;
                break;
            case 26:
                lto = 6392.00;
                break;
            default:
                lto = 0;
        }

        return lto

    }

    render() {
        let columnKey = this.state.data && this.state.data.columnKey ? this.state.data.columnKey : 0

        let popStyle = {
            display: this.state.show ? 'block' : 'none',
            width: 300, height: 200,
            borderStyle: 'solid',
            borderWidth: 1,
            backgroundColor: 'white',
            bottom: 10,
            right: 10,
            borderRadius: 5,
            position: 'absolute'
        };

        if (columnKey / this.state.pps.length >= 0.5) {
            popStyle = {...popStyle, left: 10}
        } else {
            popStyle = {...popStyle, right: 10}
        }


        return (
            <div>
                <div className='container' style={{paddingTop: 50, marginBottom: 12}}>
                    <Row>
                        <Row>
                            <Col md={2}>
                                <FieldGroup
                                    id="agentPercent"
                                    type="text"
                                    label="Agent Percent"
                                    value={this.state.agentPercent}
                                    onChange={this._handleChange}
                                    />
                            </Col>
                            <Col md={2}>
                                <FieldGroup
                                    id="marketingFee"
                                    type="text"
                                    label="Marketing Fee"
                                    value={this.state.marketingFee}
                                    onChange={this._handleChange}
                                    />
                            </Col>
                            <Col md={2}>
                                <FieldGroup
                                    id="conveyanceSell"
                                    type="text"
                                    label="Conveyance Sell"
                                    value={this.state.conveyanceSell}
                                    onChange={this._handleChange}
                                    />
                            </Col>
                            <Col md={2}>
                                <FieldGroup
                                    id="mortgageA"
                                    type="text"
                                    label="Mortgage A"
                                    value={this.state.mortgageA}
                                    onChange={this._handleChange}
                                    />
                            </Col>
                            <Col md={2}>
                                <FieldGroup
                                    id="mortgageB"
                                    type="text"
                                    label="Mortgage B"
                                    value={this.state.mortgageB}
                                    onChange={this._handleChange}
                                    />
                            </Col>
                            <Col md={2}>
                                <FieldGroup
                                    id="otherSell"
                                    type="text"
                                    label="Other Selling Cost"
                                    value={this.state.otherSell}
                                    onChange={this._handleChange}
                                    />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={2}>
                                <FieldGroup
                                    id="buildPrice"
                                    type="text"
                                    label="Build Cost"
                                    value={this.state.buildPrice}
                                    onChange={this._handleChange}
                                    />
                            </Col>
                            <Col md={2}>
                                <FieldGroup
                                    id="demolitionPrice"
                                    type="text"
                                    label="Demolition Cost"
                                    value={this.state.demolitionPrice}
                                    onChange={this._handleChange}
                                    />
                            </Col>
                            <Col md={2}>
                                <FieldGroup
                                    id="otherBuyCost"
                                    type="text"
                                    label="Other Buy Cost"
                                    value={this.state.otherBuyCost}
                                    onChange={this._handleChange}
                                    />
                            </Col>
                            <Col md={2}>
                                <FieldGroup
                                    id="rates"
                                    type="text"
                                    label="Rates"
                                    value={this.state.rates}
                                    onChange={this._handleChange}
                                    />
                            </Col>
                            <Col md={2}>
                                <FieldGroup
                                    id="conveyanceBuy"
                                    type="text"
                                    label="Conveyance Buy"
                                    value={this.state.conveyanceBuy}
                                    onChange={this._handleChange}
                                    />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12} className="bi-component fdt" style={{top: 200, width: '97%'}}>
                                <ResponsiveFixedDataTable hover style={{tableLayout: 'fixed', float: 'left'}}
                                                          ref="lvrtable"
                                                          rowHeight={30 }
                                                          rowsCount={this.state.emvs.length}
                                                          headerHeight={32}
                                                          height={490}
                                                          width={500}
                                    >
                                    <Column header={<Cell>Sell Price</Cell>}
                                            columnKey="sp"
                                            cell={props => {return(<Cell {...props}><span>{this.state.emvs[props.rowIndex]/1000}</span></Cell>)}}
                                            width={30}
                                            align="center"
                                            flexGrow={1}
                                            fixed
                                        />
                                    {this.state.pps.map((pp, i) => {
                                        return this._renderColumn(pp, i)
                                    })}
                                </ResponsiveFixedDataTable>
                            </Col>
                        </Row>
                    </Row>
                </div>
                <div style={popStyle}>
                    {this._popBody(this.state.data)}
                </div>
            </div>
        )
    }

    _renderColumn = (data, i) => {
        let header =
            <span>{data / 1000}<br/> {(data + this.state.buildPrice + this.state.demolitionPrice) / 1000}</span>

        return <Column header={<Cell>{header}</Cell>}
                       key={i}
                       columnKey={i}
                       cell={this._renderCell}
                       width={30}
                       align="center"
                       flexGrow={1}
            />
    }

    _renderCell = (data) => {
        let sellPrice = parseInt(this.state.emvs[data.rowIndex])
        let landPrice = parseInt(this.state.pps[data.columnKey])
        let lvr = this.lvr(sellPrice, landPrice)

        let bgColor = 'white'
        let selectedStyle = {}
        if (this.state.data) {
            if (data.rowIndex == this.state.data.rowIndex && data.columnKey <= this.state.data.columnKey) {
                bgColor = lvr >= 0.80 ? '#A57171' : '#679267'
            } else if (data.columnKey == this.state.data.columnKey && data.rowIndex <= this.state.data.rowIndex) {
                bgColor = lvr >= 0.80 ? '#A57171' : '#679267'
            } else {
                bgColor = lvr >= 0.80 ? '#D68383' : '#6FDC6F'
            }
            if (data.rowIndex == this.state.data.rowIndex && data.columnKey == this.state.data.columnKey) {
                selectedStyle = {color: 'white'}
            }
        } else {
            bgColor = lvr >= 0.80 ? '#D68383' : '#6FDC6F'
        }
        let style = {...selectedStyle, backgroundColor: bgColor}

        return (
            <Cell {...data} onClick={() => this._showData(data)} style={style}>
                <span>{(lvr * 100).toFixed(2)}</span>
            </Cell>
        )
    }

    _showData(data) {
        let show = !this.state.show
        this.setState({show: show, data: show ? data : null})
    }

    _getRow(label, value, debit, border, bold, notRightFixed) {
        const className = !!debit ? "row-panel red" : "row-panel"
        let style = {};
        if (!!border) {
            style = {...style, borderBottom: '1px solid', borderTop: '1px solid'}
        }
        if (!!bold) {
            style = {...style, fontWeight: 'bold'}
        }

        let fixedRight = !!notRightFixed ? "" : "fixed-right"

        return (
            <Row className={className} style={style}>
                <Col md={7}>
                    {label}
                </Col>
                <Col className={fixedRight} md={5}>
                    {value}
                </Col>
            </Row>)
    }

    _sellFees(sellPrice) {
        return this.agentFee(sellPrice) + this.state.marketingFee + this.state.conveyanceSell + this.mortgage() + this.state.otherSell
    }

    _showSellFees(sellPrice) {
        return (
            <Popover id="sellcosts" title="Sell Fees" style={{width: 300}}>
                {this._getRow('Agent Fee', this.dollarFormatter.format(this.agentFee(sellPrice)), true)}
                {this._getRow('Marketing', this.dollarFormatter.format(this.state.marketingFee), true)}
                {this._getRow('Conveyance sell', this.dollarFormatter.format(this.state.conveyanceSell), true)}
                {this._getRow('Mortgages', this.dollarFormatter.format(this.mortgage()), true)}
                {this._getRow('Mortgages', this.dollarFormatter.format(this.state.otherSell), true)}
                {this._getRow('Total sell fees', this.dollarFormatter.format(this._sellFees(sellPrice)), true, true)}
            </Popover>
        )
    }

    _purchaseFees(landPrice) {
        return this.state.rates + this.state.conveyanceBuy + this.state.otherBuyCost + this.stampDuty(landPrice) + this.lto(landPrice)
    }

    _showPurchaseFees(landPrice) {
        return (
            <Popover id="purchasecosts" title="Purchase Fees" style={{width: 300}}>
                {this._getRow('Rates', this.dollarFormatter.format(this.state.rates), true)}
                {this._getRow('Conveyance buy', this.dollarFormatter.format(this.state.conveyanceBuy), true)}
                {this._getRow('Other costs', this.dollarFormatter.format(this.state.otherBuyCost), true)}
                {this._getRow('Stamp duty', this.dollarFormatter.format(this.stampDuty(landPrice)), true)}
                {this._getRow('LTO Transfer', this.dollarFormatter.format(this.lto(landPrice)), true)}
                {this._getRow('Total buy fees', this.dollarFormatter.format(this._purchaseFees(landPrice)), true, true)}
            </Popover>
        )
    }

    _popBody(data) {
        if (!data) {
            return null
        }
        let sellPrice = this.state.emvs[data.rowIndex]
        let landPrice = this.state.pps[data.columnKey]
        let placement = data.columnKey / this.state.pps.length >= 0.5 ? 'right' : 'left'
        return (
            <div style={{padding: 5, textAlign: 'right'}}>
                {this._getRow('Sell Price', this.dollarFormatter.format(sellPrice))}
                <OverlayTrigger trigger="click" rootClose placement={placement} overlay={this._showSellFees(sellPrice)}>
                    {this._getRow('Sell Fees*', this.dollarFormatter.format(this._sellFees(sellPrice)), true)}
                </OverlayTrigger>
                {this._getRow('After Sale Cash', this.dollarFormatter.format(this.afterSaleCash(sellPrice)), false, true)}
                {this._getRow('Land Price', this.dollarFormatter.format(landPrice), true)}
                {this._getRow('Build Price', this.dollarFormatter.format(this.state.buildPrice + this.state.demolitionPrice), true)}
                <OverlayTrigger trigger="click" rootClose placement={placement}
                                overlay={this._showPurchaseFees(landPrice)}>
                    {this._getRow('Purchase Fees*', this.dollarFormatter.format(this._purchaseFees(landPrice)), true)}
                </OverlayTrigger>
                {this._getRow('Purchase cost', this.dollarFormatter.format(this.purchaseCost(landPrice)), true, true)}
                {this._getRow('Loan', this.dollarFormatter.format(this.loan(sellPrice, landPrice)), false, false, true)}
                {this._getRow('LVR', this.percentFormatter.format(this.lvr(sellPrice, landPrice)), false, false, true, true)}
            </div>
        )
    }


}

export default App

class FieldGroup extends React.Component {

    render() {
        return (
            <FormGroup controlId={this.props.id}>
                <ControlLabel>{this.props.label}</ControlLabel>
                <FormControl {...this.props} />
            </FormGroup>
        )
    }
}