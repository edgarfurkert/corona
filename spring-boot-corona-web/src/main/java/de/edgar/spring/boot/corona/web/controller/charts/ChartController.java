package de.edgar.spring.boot.corona.web.controller.charts;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttributes;

import de.edgar.spring.boot.corona.web.model.CoronaDataSession;
import de.edgar.spring.boot.corona.web.model.charts.BarChartData;
import de.edgar.spring.boot.corona.web.model.charts.BubbleChartData;
import de.edgar.spring.boot.corona.web.model.charts.LineChartData;
import de.edgar.spring.boot.corona.web.model.charts.StackedAreaChartData;
import de.edgar.spring.boot.corona.web.model.charts.StackedBarChartData;
import de.edgar.spring.boot.corona.web.service.GraphDataService;
import lombok.extern.slf4j.Slf4j;

/**
 * User: gardiary
 * Date: 12/11/17, 21:31
 */
@Slf4j
@Profile("!api")
@RestController
@SessionAttributes("coronaDataSession")
public class ChartController {
	
	@Autowired
	private GraphDataService graphService;
	
	@GetMapping("/ajax/lineGraph")
    public LineChartData getLineGraph(@ModelAttribute CoronaDataSession cds) {
		return graphService.getLineGraphData(cds);
    }
	
    @GetMapping("/ajax/barGraph")
    public BarChartData getBarGraph(@ModelAttribute CoronaDataSession cds) {
    	return graphService.getBarGraphData(cds);
    }

    @GetMapping("/ajax/stackedBarGraph")
    public StackedBarChartData getStackedBarGraph(@ModelAttribute CoronaDataSession cds) {
    	return graphService.getStackedBarChartData(cds);
    }

    @GetMapping("/ajax/stackedAreaGraph")
    public StackedAreaChartData getStackedAreaGraph(@ModelAttribute CoronaDataSession cds) {
    	return graphService.getStackedAreaChartData(cds);
    }

    @GetMapping("/ajax/infectionsAndGraph")
    public LineChartData getInfectionsAndGraph(@ModelAttribute CoronaDataSession cds) {
    	return graphService.getInfectionsAndGraphData(cds);
    }

    @GetMapping("/ajax/bubbleGraph")
    public BubbleChartData getBubbleGraph(@ModelAttribute CoronaDataSession cds) {
		return graphService.getBubbleGraphData(cds);
    }
}
