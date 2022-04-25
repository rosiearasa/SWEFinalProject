/*
    Author: Maya Johnson
    Date: 4/23/22
    Displays all items in the database with the following fields:
        Item type, associated user (if not anonymous), expiration date,
        and associated note (if public)
 */

package edu.brynmawr.cs353.thefridge;

import android.os.Bundle;
import android.util.Log;
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
    JSONArray items;    //items in the fridge
    String user = null; //current user

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        user = getIntent().getStringExtra("user");
        setContentView(R.layout.activity_see_items);

        //reads items in fridge from NodeExpress
        getItemsFromDatabase();

        //formats and displays the items
        ItemAdapter adapter = new ItemAdapter(this, items);
        ListView listView = (ListView) findViewById(R.id.item_list);
        listView.setAdapter(adapter);
    }


    //connects to NodeExpress /api to get the items in the fridge
    public void getItemsFromDatabase() {

        try {
            Log.v("checking", "Getting items from database");
            ExecutorService executor = Executors.newSingleThreadExecutor();
            executor.execute( () -> {
                try {
                    //want the /api endpoint
                    URL url = new URL("http://10.0.2.2:3000/api");

                    //open the connection and send the url through
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("GET");
                    conn.connect();

                    //read in returned JSON Array of items in the fridge
                    Scanner in = new Scanner(url.openStream());
                    String response = in.nextLine();
                    items = new JSONArray(response);

                    Log.v("items", items.toString());

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
        }
    }

}
