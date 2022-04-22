package edu.brynmawr.cs353.thefridge;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ListView;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONArray;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class SeeItemsActivity extends AppCompatActivity {
    String[] mobileArray = {"Android","IPhone","WindowsMobile","Blackberry", "WebOS","Ubuntu","Windows7","Max OS X"};
    JSONArray items;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_see_items);

        //ArrayAdapter adapter = new ArrayAdapter<String>(this,
        //        R.layout.activity_list_view, mobileArray);
        getItemsFromDatabase();
        ItemAdapter adapter = new ItemAdapter(this, items);

        ListView listView = (ListView) findViewById(R.id.item_list);
        listView.setAdapter(adapter);
    }

    public void goToMyItems(View v) {
        Intent intent = new Intent(this, MyItems.class);
        startActivity(intent);
    }

    public void getItemsFromDatabase() {
        //JSONArray items;
        try {
            ExecutorService executor = Executors.newSingleThreadExecutor();
            executor.execute( () -> {
                        try {
                            //create the url for /add_item
                            URL url = new URL("http://10.0.2.2:3000/api");

                            //open the connection and send the url through
                            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                            conn.setRequestMethod("GET");
                            conn.connect();

                            Scanner in = new Scanner(url.openStream());
                            String response = in.nextLine();

                            items = new JSONArray(response);

                            Log.v("message", items.toString());

                        }
                        catch (Exception e) {
                            Log.v("error", e.toString());
                        }
                    }
            );

            // this waits for up to 2 seconds
            // it's a bit of a hack because it's not truly asynchronous
            // but it should be okay for our purposes (and is a lot easier)
            executor.awaitTermination(2, TimeUnit.SECONDS);

            // now we can set the status in the TextView
            Log.v("message", "finished everything");
        }
        catch (Exception e) {
            // uh oh
            e.printStackTrace();
            //tv.setText(e.toString());
        }
    }

}
