import javax.swing.*;
import java.awt.*;
import java.awt.geom.Ellipse2D;
import java.awt.geom.Path2D;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.URL;
import javax.imageio.ImageIO;
import org.json.JSONArray;
import org.json.JSONObject;

public class TrafficMap extends JPanel {

    private BufferedImage mapImage;
    private JSONArray trafficData;
    private int currentIndex = 0;

    private final int BASE_WIDTH = 700;
    private final int BASE_HEIGHT = 450;

    // Polygon coordinates
    private final int[][] road1 = {{75,342},{253,126},{289,155},{137,341}};
    private final int[][] road3 = {{358,128},{314,160},{440,341},{532,340}};

    private final Ellipse2D.Double intersection = new Ellipse2D.Double(
            (358 + 532)/2.0, (128 + 340)/2.0,
            Math.abs(532 - 358), Math.abs(340 - 128)
    );

    private String UL1_status = "Free";
    private String UL2_status = "Free";
    private String UL3_status = "Free";

    public TrafficMap() {
        setPreferredSize(new Dimension(BASE_WIDTH, BASE_HEIGHT));
        try {
            // Load background image
            mapImage = ImageIO.read(new File("Triangular Object with Yellow Accents.png"));
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Load traffic JSON from URL
        loadTrafficData("https://raw.githubusercontent.com/jumana-farid/g12-capstone-/main/trafficPredictor.json");

        // Timer to update traffic every 10 seconds
        new Timer(10000, e -> nextTrafficState()).start();
    }

    private void loadTrafficData(String urlStr) {
        try {
            URL url = new URL(urlStr);
            BufferedReader reader = new BufferedReader(new InputStreamReader(url.openStream()));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) sb.append(line);
            reader.close();

            trafficData = new JSONArray(sb.toString());
            applyTrafficState();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void applyTrafficState() {
        if (trafficData == null || trafficData.length() == 0) return;

        JSONObject state = trafficData.getJSONObject(currentIndex);
        UL1_status = state.getString("UL1_status");
        UL2_status = state.getString("UL2_status");
        UL3_status = state.getString("UL3_status");

        repaint();
    }

    private void nextTrafficState() {
        currentIndex++;
        if (currentIndex >= trafficData.length()) currentIndex = 0;
        applyTrafficState();
    }

    private Color getColor(String status) {
        if (status == null) return new Color(0,255,0,128);
        String s = status.toLowerCase();
        if (s.contains("occupied")) return new Color(255,0,0,128);
        if (s.contains("use")) return new Color(255,255,0,128);
        return new Color(0,255,0,128);
    }

    private int scaleX(int x) {
        return x * getWidth() / BASE_WIDTH;
    }

    private int scaleY(int y) {
        return y * getHeight() / BASE_HEIGHT;
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        if (mapImage == null) return;

        Graphics2D g2 = (Graphics2D) g;
        g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 0.4f));
        g2.drawImage(mapImage, 0, 0, getWidth(), getHeight(), null);
        g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 1f));

        // Draw Road 1
        Path2D road1Path = new Path2D.Double();
        road1Path.moveTo(scaleX(road1[0][0]), scaleY(road1[0][1]));
        for (int i = 1; i < road1.length; i++) {
            road1Path.lineTo(scaleX(road1[i][0]), scaleY(road1[i][1]));
        }
        road1Path.closePath();
        g2.setColor(getColor(UL1_status));
        g2.fill(road1Path);

        // Draw Road 3
        Path2D road3Path = new Path2D.Double();
        road3Path.moveTo(scaleX(road3[0][0]), scaleY(road3[0][1]));
        for (int i = 1; i < road3.length; i++) {
            road3Path.lineTo(scaleX(road3[i][0]), scaleY(road3[i][1]));
        }
        road3Path.closePath();
        g2.setColor(getColor(UL3_status));
        g2.fill(road3Path);

        // Draw Intersection
        double ix = intersection.x * getWidth() / BASE_WIDTH;
        double iy = intersection.y * getHeight() / BASE_HEIGHT;
        double irx = intersection.width * getWidth() / BASE_WIDTH;
        double iry = intersection.height * getHeight() / BASE_HEIGHT;
        g2.setColor(getColor(UL2_status));
        g2.fill(new Ellipse2D.Double(ix - irx/2, iy - iry/2, irx, iry));
    }

    public static void main(String[] args) {
        JFrame frame = new JFrame("Traffic Map");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.add(new TrafficMap());
        frame.pack();
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }
}
